/**
 * Created by 赢潮 on 2015/7/23.
 */
var TIME_SLICE_COUNT = 7;
var TIME_SLOT_LENGTH = 1/TIME_SLICE_COUNT;
var UP_SCALE_RATE = 20;
var START_YEAR = 0;
var MAX_YEAR = 100000;

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

            initTech: [["quantum-communication"]],
            unlockedTech: [
                ["exoskeleton","space-elevator","virtual-reality","memory-storage", "spirit-of-science","bionic"],
                ["anti-gravity","fusion-drive","clone-human","cure-cancer","psychohistory","spirit-of-adventure"],
                ["anti-matter","cure-old","exoskeleton"],
                ["warp-engine","exoskeleton"],
                ["dyson-sphere","meaning-of-life"]
            ],
            maxTechLevel: 5,
            maxLevelOneTech : 5,

            discountPerMatch: 0.1,

            shipCapacity: 1, //载人数，单位万
            shipSpeed: 0.001,

            maxPopulationIncreaseWarRate: 0.1,
            maxPopulationIncreaseLaunchRate: 0.2
        }
    },
    initialize:function(){
        this._colonizedCount = 0;
        this._colonies = [];
        this._ships = [];
        this._stars = [];

        this._effectTechEntry = {};

        for ( var i = 0; i < TIME_SLICE_COUNT; i++) {
            this._colonies.push([]);
            this._ships.push([]);
        }

        this._tech = [];
        _.each(this.get("initTech"),function(tier){
            var tierTech = [];
            _.each(tier,function(name){
                tierTech.push( new CLASS_MAP[name]() );
            },this);
            this._tech.push(tierTech)
        },this);

        this._availableTech = [];
        _.each(this.get("unlockedTech"),function(tier){
            var tierTech = [];
            _.each(tier,function(name){
                tierTech.push( new CLASS_MAP[name]() );
            },this);
            this._availableTech.push(tierTech)
        },this);
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
        techModel.onGain();
    },
    initAll:function(){
        this._generateGalaxy();
        this._initColony();
    },
    _initColony:function(){
        this.startingColony = new ColonyModel({
            name: "地球",
            population: 800000,
            populationGrowRate: 0.1,
            maxPopulation: 1200000
        });
        this.startingColony.starSystem = this.startingStarSystem;
        this.startingStarSystem.colony = this.startingColony;
        this.startingStarSystem.set("name","太阳系");
        this.addColony(this.startingColony);

        _.each(this._colonies,function(slot){
            _.each(slot,function(colony){
                this.getPopulation(colony.get("population"));
                this.getScore(colony.get("population"));
            },this);
        },this);
    },
    addColony:function(colony){
        var slot = Math.floor(Math.random()*TIME_SLICE_COUNT);
        colony.timeSlot = slot;
        this._colonies[slot].push(colony);

        this._colonizedCount ++;
        if ( this.isAllStarSystemColonized() ) {
            this.trigger("gameover",this);
        }
    },
    addShip:function(ship){
        //TODO add log

        var slot = Math.floor(Math.random()*TIME_SLICE_COUNT);
        ship.timeSlot = slot;
        this._ships[slot].push(ship);
        this.trigger("launch", ship);
    },
    removeShip:function(ship){
        var slot = ship.timeSlot;
        var index = _.indexOf(this._ships[slot], ship);
        this._ships[slot].splice(index,1);
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
    evaluateShips:function(timeSlot){
        if ( timeSlot >= TIME_SLICE_COUNT ) return;
        var shipList = this._ships[timeSlot];
        _.each( shipList, function( ship ) {
            ship.evaluate();
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
        var staringStarSystemNumber = 256;

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
                    this._generateOneStar( currentAngle + divideAngle*i + offset.a, currentR+offset.r);
                    currentCount++;
                    if ( currentCount == staringStarSystemNumber ) {
                        this.startingStarSystem = this._stars[this._stars.length - 1];
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
            if ( this.startingStarSystem == starSysModel ) {
                var name1 = this._stars[0].get("name");
                var name2 = starSysModel._otherStarSystemEntry[0].star.get("name");
                starSysModel._otherStarSystemEntry[0].star.set("name",name1);
                this._stars[0].set("name",name2);
            }
        },this);
        var t3 = new Date().getTime();
        cc.log("calculating star distance, use time:"+(t3-t2));
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
    }
});