/**
 * Created by 赢潮 on 2015/7/23.
 */
var TIME_SLICE_COUNT = 7;
var TIME_SLOT_LENGTH = 1/TIME_SLICE_COUNT;
var UP_SCALE_RATE = 35;
var DISTANCE_ADJUST = 2;
var START_YEAR = 0;
var MAX_YEAR = 100000;
var MAX_SHIP_NUMBER = 250;

var GameModel = Backbone.Model.extend({
    defaults: function () {
        return {
            playerName:"地球人",
            year: START_YEAR,
            maxYear: MAX_YEAR,
            score: 0,
            totalPopulation: 0,
            humanity: 1,

            science: 0,

            savedTech: [],
            initTech: [["quantum-communication"]],
            unlockedTech: [
                ["exoskeleton","space-elevator","virtual-reality","memory-storage", "spirit-of-science","bionic","nanobot","great-firewall"],
                ["anti-gravity","fusion-drive","clone-human","cure-cancer","psychohistory","spirit-of-adventure","gill","cyber-brain"],
                ["anti-matter","cure-old","multiverse-communication","intelligent-dolphin","resistance-cold","resistance-heat","mind-control"],
                ["warp-engine","intelligent-ape","wing","telekinesis"],
                ["dyson-sphere","meaning-of-life","time-machine","group-mind"]
            ],
            maxTechLevel: 5,
            maxLevelOneTech : 5,

            discountPerMatch: 0.1,

            shipCapacity: 1, //载人数，单位万
            shipSpeed: 0.001,

            maxPopulationIncreaseWarRate: 0.1,
            maxPopulationWarThreshold: 1000,

            maxPopulationIncreaseLaunchRate: 0.2,
            maxPopulationLaunchThreshold: 1000
        }
    },
    initialize:function(){
        this._colonizedCount = 0;
        this._currentColonySlot = 0;
        this._colonies = [];
        this._ships = [];
        this._stars = [];
        this._techCountByType = [];
        this._logs = [];

        this._effectTechEntry = {};

        for ( var i = 0; i < TIME_SLICE_COUNT; i++) {
            this._colonies.push([]);
            this._ships.push([]);
        }
    },
    isTechAvailable:function(name){
        _.each(this._availableTech,function(tier){
            _.each(tier,function(techName){
                if ( techName === name ) return true;
            },this);
        },this);
        return false;
    },
    hasTech:function(name){
        for ( var i = 0 ,length = this._tech.length; i < length; i++ ){
            var tier = this._tech[i];
            for ( var j = 0 ,len2 = tier.length; j < len2; j++ ){
                var techModel = tier[j];
                if ( techModel === name || techModel.get("name") === name ) {
                    return techModel;
                }
            }
        }
        for ( var i = 0 ,length = this._extraTech.length; i < length; i++ ){
            var techModel = this._extraTech[i];
            if ( techModel === name || techModel.get("name") === name ) {
                return techModel;
            }
        }
    },
    isAllTechPyramidFull:function(){
        var maxLevel = this.get("maxTechLevel");
        return this._tech.length >= maxLevel && this._tech[maxLevel-1].length >= ( this.get("maxLevelOneTech") - maxLevel - 1);
    },
    techCount:function(level){
        if ( this._tech.length <= level )
            return 0;
        return this._tech[level].length;
    },
    getTech:function(level, techModel, cost){
        this.set("science",this.get("science") - cost);
        var index = _.indexOf(this._availableTech[level],techModel);
        if ( index != -1 ) {
            this._availableTech[level].splice(index,1);
            if ( this._tech.length <= level ) {
                this._tech.push([]);
            }
            this._tech[level].push(techModel);
        }
        this.addTechCountByType(techModel);
        techModel.onGain();
    },
    addTechCountByType:function(techModel){
        _.each( techModel.get("types"),function(type){
            if ( this._techCountByType[type] ) {
                this._techCountByType[type] ++;
            } else this._techCountByType[type] = 1;
        },this);
    },
    techCountByType:function(type){
        return this._techCountByType[type];
    },
    initAll:function(){
        this._shipCount = 0;
        this._totalShipCount = 0;
        this._initTech();
        this._generateGalaxy();
        this._initColony();
    },
    _initTech:function(){
        this._extraTech = [];
        _.each(this.get("savedTech"),function(name){
            var techModel = new CLASS_MAP[name]();
            this.addTechCountByType(techModel);
            techModel.onGain();
            techModel._isFromMultiverse = true;
            this._extraTech.push( techModel );
        },this);

        this._tech = [];
        _.each(this.get("initTech"),function(tier){
            var tierTech = [];
            _.each(tier,function(name){
                if ( !_.contains(this.get("savedTech"), name) ) {
                    tierTech.push(new CLASS_MAP[name]());
                }
            },this);
            this._tech.push(tierTech)
        },this);

        this._availableTech = [];
        _.each(this.get("unlockedTech"),function(tier){
            var tierTech = [];
            _.each(tier,function(name){
                if ( !_.contains(this.get("savedTech"), name) ) {
                    tierTech.push(new CLASS_MAP[name]());
                }
            },this);
            this._availableTech.push(tierTech)
        },this);
    },
    _initColony:function(){

        this.startingColony = new ColonyModel({
            name: "",
            population: 800000,
            populationGrowRate: 0.1
        });

        this.startingColony.starSystem = this.startingStarSystem;
        this.startingStarSystem.colony = this.startingColony;
        this.startingStarSystem.set("name","太阳系");

        this.startingColony.planet = this.startingStarSystem._bestPlanet;
        this.addColony(this.startingColony);

        //将最近的星系改为半人马alpha
        var oldStar = this.startingStarSystem._otherStarSystemEntry[0].star;
        var oldStarName = oldStar.get("name");
        var alphaStar = this._stars[0];
        var alphaStarName = alphaStar.get("name");
        alphaStar.set("name", oldStarName);
        oldStar.set("name",alphaStarName);

        _.each(this._colonies,function(slot){
            _.each(slot,function(colony){
                this.getPopulation(colony.get("population"));
                this.getScore(colony.get("population")/10000);
            },this);
        },this);
    },
    addColony:function(colony){
        var slot = this._currentColonySlot;
        this._currentColonySlot++;
        if ( this._currentColonySlot >= TIME_SLICE_COUNT )
            this._currentColonySlot = 0;

        colony.timeSlot = slot;
        this._colonies[slot].push(colony);

        this._colonizedCount ++;
        if ( this.isAllStarSystemColonized() ) {
            this.trigger("gameover",this);
        }
    },
    hasMaxShip:function(){
        return this._shipCount >= MAX_SHIP_NUMBER;
    },
    addShip:function(ship){
        this._shipCount ++;
        this._totalShipCount++;
        this.trigger("launch", ship);
    },
    removeShip:function(ship){
        this._shipCount --;
    },
    getShipCountInHistory:function(){
        return this._totalShipCount;
    },
    getPopulation:function(change) {
        this.set("totalPopulation",this.get("totalPopulation")+change);
    },
    getScore:function(score){
        this.set("score",this.get("score")+score*this.get("humanity"));
    },
    getScience:function(science){
        this.set("science",this.get("science")+science);
    },

    evaluateColonies:function(timeSlot){
        if ( timeSlot >= TIME_SLICE_COUNT ) return;
        var colonyList = this._colonies[timeSlot];
        _.each( colonyList, function( colony ) {
            colony.evaluate();
        });
    },
    _generateGalaxy:function(){
        var toR = 88, stepR = 5, stepRRandomRange = 1, rRandomRange = 5;
        var currentR;
        var currentAngle = 4.5, stepAngle = 0.6, stepAngleRandomRange = 0, angleRandomRange = 0.1;
        var alpha = Math.PI/12;
        var currentCount = 0;
        var clusterNumber = 1;
        var divide = 4;
        var divideAngle = Math.PI*2/divide;
        var staringStarSystemNumber = 251 + Math.round(Math.random()*10);

        var _a= 0.1;
        var _ar = 2;
        var _b = 0.04
        var _br = 4;
        var _c = 0.020;
        var _cr = 3;
        var _d = 0.002;
        var _dr = 2;
        var cluster = [ [{ a:0,r:0}],
            [ { a:-_a, r:-_ar }, { a:_a, r:-_ar }, { a:-_a, r:_ar }, { a:_a, r:_ar }, { a: 0, r: 0}],
            [ { a:-_b, r:-_br }, { a:0, r:-_br }, { a:_b, r:-_br },
              { a:-_b, r:0 }, { a:0, r:0 }, { a:_b, r:0 },
              { a:-_b, r:_br }, { a:0, r:_br }, { a:_b, r:_br } ],
            [ { a:-_c, r:-_cr }, { a:_c, r:-_cr }, { a:-_c, r:_cr }, { a:_c, r:_cr }, { a: 0, r: 0} ],
            [ { a:0, r:-_dr }, { a:0, r:-_dr/2 }, { a:0, r:_dr }, { a:0, r:_dr/2 }, { a: 0, r: 0} ]
        ];
        var clusterNumber = [ 1, 2, 4, 2, 1 ];
        var currentClusterNumber = 0;
        var currentCluster = cluster[currentClusterNumber];
        var count = clusterNumber[currentClusterNumber];
        var t1 = new Date().getTime();
        do {
            currentR = Math.pow( Math.E, currentAngle*alpha );
            for ( var i = 0; i < divide; i++ ) {
                var c = _.sample(currentCluster, count);
                _.each( c, function(offset){
                    currentCount++;
                    if ( currentCount === staringStarSystemNumber ) {
                        this._generateHomeWorld( currentAngle + divideAngle*i + offset.a, currentR+offset.r );
                    } else {
                        this._generateOneStar( currentAngle + divideAngle*i + offset.a, currentR+offset.r);
                    }
                },this);
            }


            currentAngle += stepAngle;
            if ( stepAngle > 0.025 )
                stepAngle *= 0.955;
            else stepAngle = 0.025;
            if ( currentR > 78 ) {
                currentClusterNumber = 4;
                currentCluster = cluster[currentClusterNumber];
                count = clusterNumber[currentClusterNumber];
            } else if ( currentR > 59 ) {
                currentClusterNumber = 3;
                currentCluster = cluster[currentClusterNumber];
                count = clusterNumber[currentClusterNumber];
            } else if ( currentR > 41 ) {
                currentClusterNumber = 2;
                currentCluster = cluster[currentClusterNumber];
                count = clusterNumber[currentClusterNumber];
            } else if ( currentR > 15 ) {
                currentClusterNumber = 1;
                currentCluster = cluster[currentClusterNumber];
                count = clusterNumber[currentClusterNumber];
            }
        } while ( currentR <= toR );
        var t2 = new Date().getTime();
        cc.log(currentCount+" star generated, use time:"+(t2-t1));
        //cal dist
        _.each(this._stars,function(starSysModel){
            var list = [];
            _.each(this._stars,function(star){
                if ( starSysModel == star ) return;
                list.push({
                    star: star,
                    distance_2: Math.pow(star.get("x")-starSysModel.get("x"),2)+Math.pow(star.get("y")-starSysModel.get("y"),2)
                });
            },this);
            starSysModel._otherStarSystemEntry = _.sortBy(list,function(entry){
                return entry.distance_2;
            },this);
        },this);
        var t3 = new Date().getTime();
        cc.log("calculating star distance, use time:"+(t3-t2));
    },
    _generateHomeWorld:function( angle, radius ) {
        var position = polarToXY(angle , radius);
        var starSystem = new SunSystemModel({
            x: -position.x*UP_SCALE_RATE,
            y: position.y*UP_SCALE_RATE
        });
        this._stars.push(starSystem);
        this.startingStarSystem = starSystem;
    },
    _generateOneStar:function( angle, radius ) {
        var position = polarToXY(angle , radius);
        var starSystem = new StarSystemModel({
            name: generateStarSystemName(),
            x: -position.x*UP_SCALE_RATE,
            y: position.y*UP_SCALE_RATE
        });
        this._stars.push(starSystem);
    },
    getColonizedStarSystems:function(){
        return _.filter(this._stars,function(star){
            return star.isColonized();
        },this);
    },
    getAllStarSystems:function(){
        return this._stars;
    },
    isAllStarSystemColonized:function(){
        return this._colonizedCount >= this._stars.length;
    },
    registerEffectingTech:function(type, techModel, func){
        if ( !this._effectTechEntry[type] )
            this._effectTechEntry[type] = [];
        this._effectTechEntry[type].push({
            model: techModel,
            func : func
        });
    },
    techEffect:function(type, production){
        return _.reduce(this._effectTechEntry[type],function(p, techModelEntry){
            return techModelEntry.func.call(techModelEntry.model, p);
        }, production);
    },
    addLog:function(text){
        this._logs.push(Math.round(this.get("year"))+"G.A. "+text);
    },
    getLogs:function(){
        return this._logs;
    }
});