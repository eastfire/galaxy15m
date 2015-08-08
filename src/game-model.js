/**
 * Created by 赢潮 on 2015/7/23.
 */
var TIME_SLICE_COUNT = 7;
var TIME_SLOT_LENGTH = 1/TIME_SLICE_COUNT;
var UP_SCALE_RATE = 20;
var START_YEAR = 0;

var GameModel = Backbone.Model.extend({
    defaults: function () {
        return {
            year: START_YEAR,
            maxYear: 100000,
            score: 0,
            totalPopulation: 0,
            humanity: 1,

            science: 0,

            initTech: [["quantum-communication","quantum-communication"]],
            unlockedTech: [

            ]
        }
    },
    initialize:function(){
        this._colonies = [];
        this._ships = [];
        this._stars = [];

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

    },
    isTechAvailable:function(name){
        _.each(this.get("unlockedTech"),function(tier){
            _.each(tier,function(techName){
                if ( techName === name ) return true;
            },this);
            this._tech.push(tierTech)
        },this);
        return false;
    },
    hasTech:function(name){
        _.each(this._tech,function(tier){
            _.each(tier,function(techModel){
                if ( techModel.get("name") === name ) return true;
            },this);
            this._tech.push(tierTech)
        },this);
        return false;
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
            maxPopulation: 1000000
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
        var toR = 85, stepR = 5, stepRRandomRange = 1, rRandomRange = 5;
        var currentR;
        var currentAngle = 4.5, stepAngle = 0.6, stepAngleRandomRange = 0, angleRandomRange = 0.1;
        var alpha = Math.PI/12;
        var currentCount = 0;
        var clusterNumber = 1;
        var cluster2R = 80;
        var cluster3R = 80;
        var divide = 4;
        var divideAngle = Math.PI*2/divide;
        var staringStarSystemNumber = 270;

        var _a= 0.1;
        var _ar = 2;
        var _b = 0.04
        var _br = 4;
        var _c = 0.025;
        var _cr = 2;
        var cluster = [ [{ a:0,r:0}],
            [ { a:-_a, r:-_ar }, { a:_a, r:-_ar }, { a:-_a, r:_ar }, { a:_a, r:_ar }, { a: 0, r: 0}],
            [ { a:-_b, r:-_br }, { a:0, r:-_br }, { a:_b, r:-_br },
              { a:-_b, r:0 }, { a:0, r:0 }, { a:_b, r:0 },
              { a:-_b, r:_br }, { a:0, r:_br }, { a:_b, r:_br } ],
            [ { a:-_c, r:-_cr }, { a:_c, r:-_cr }, { a:-_c, r:_cr }, { a:_c, r:_cr }, { a: 0, r: 0} ],
            [{ a:0,r:0}]
        ];
        var currentClusterNumber = 0;
        var currentCluster = cluster[currentClusterNumber];
        var t1 = new Date().getTime();
        do {
            currentR = Math.pow( Math.E, currentAngle*alpha );
            for ( var i = 0; i < divide; i++ ) {
                var count = Math.ceil( currentCluster.length/2 );
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
            if ( stepAngle > 0.02 )
                stepAngle *= 0.955;
            else stepAngle = 0.02;
            if ( currentR > 75 ) {
                currentCluster = cluster[4];
            } else if ( currentR > 60 ) {
                currentCluster = cluster[3];
            } else if ( currentR > 40 ) {
                currentCluster = cluster[2];
            } else if ( currentR > 15 ) {
                currentCluster = cluster[1];
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
    }
});