/**
 * Created by 赢潮 on 2015/2/25.
 */
var STAR_SYSTEM_NAME_POOL = [ "半人马","小熊","大熊","仙后","天龙","仙王","蝎虎","仙女","鹿豹","御夫","猎犬",
    "狐狸","天鹅","小狮","英仙","牧夫","武仙","后发","北冕","天猫","天琴","海豚","飞马","三角","天箭","巨蟹",
    "白羊","双子","宝瓶","室女","狮子","金牛","双鱼","摩羯","天蝎","天秤","人马","小马","小犬","天鹰","蛇夫","巨蛇",
    "六分仪","长蛇","麒麟","猎户","鲸鱼","天坛","绘架","苍蝇","山案","印第安","天燕","飞鱼","矩尺","剑鱼","时钟",
    "杜鹃","南三角","圆规","蝘蜓","望远镜","水蛇","南十字","凤凰","孔雀","南极","网罟","天鹤","南冕","豺狼","大犬",
    "天鸽","乌鸦","南鱼","天兔","船底","船尾","罗盘","船帆","玉夫","波江","盾牌","天炉","唧筒","雕具","显微镜","巨爵" ]
var STAR_SYSTEM_ORDER = ["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ","ψ","ω"]

var FIXED_STAR_RED_GIANT = 1;
var FIXED_STAR_NORMAL = 2;
var FIXED_STAR_WHITE_DWARF = 3;

var CORE_GASEOUS = 1;
var CORE_SOLID = 2;

var GRAVITY_VERY_LOW = 0;
var GRAVITY_LOW = 1;
var GRAVITY_NORMAL = 2;
var GRAVITY_HIGH = 3;
var GRAVITY_VERY_HIGH = 4;

var FIXED_STAR_TYPES = [ FIXED_STAR_NORMAL, FIXED_STAR_NORMAL, FIXED_STAR_NORMAL, FIXED_STAR_NORMAL, FIXED_STAR_RED_GIANT, FIXED_STAR_WHITE_DWARF];
var PLANET_NUMBER_POOL = [ 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, 7, 8]
var PLANET_TYPE_POOL = [CORE_GASEOUS,CORE_GASEOUS,CORE_GASEOUS,CORE_GASEOUS,CORE_GASEOUS,CORE_SOLID,CORE_SOLID,CORE_SOLID,CORE_SOLID,CORE_SOLID];
var PLANET_GRAVITY_POOL = [GRAVITY_VERY_LOW, GRAVITY_LOW,GRAVITY_LOW, GRAVITY_NORMAL,GRAVITY_NORMAL,GRAVITY_NORMAL, GRAVITY_HIGH ];

var starNameGenerated;
var generateStarSystemName=function() {
    var name;
    if ( starNameGenerated === undefined  ) {
        starNameGenerated = {};
        name = STAR_SYSTEM_NAME_POOL[0];
    } else {
        name = _.sample(STAR_SYSTEM_NAME_POOL);
    }
    var currentCount = starNameGenerated[name];
    if ( currentCount ) {
        starNameGenerated[name] = currentCount+1;
    } else {
        currentCount = 0;
        starNameGenerated[name] = 1;
    }
    if ( currentCount >= STAR_SYSTEM_ORDER.length ) {
        var turn = Math.ceil( (currentCount+1) / STAR_SYSTEM_ORDER.length );
        currentCount = currentCount % STAR_SYSTEM_ORDER.length;
        name = name+"座"+STAR_SYSTEM_ORDER[currentCount]+turn;
    } else {
        name = name+"座"+STAR_SYSTEM_ORDER[currentCount];
    }
    return name;
}

var StarSystemModel = Backbone.Model.extend({
    defaults:function(){
        return {
            name: null,
            x: 0,
            y: 0
        }
    },
    isColonized:function(){
        return this.colony != null;
    },
    isColonizing:function(){
        return this.colonizingShip != null;
    },
    setColonizing:function(ship){
        this.colonizingShip = ship;
    },
    initialize:function(){
        this._fixedStars = [];
        this._planets = [];

        this._planetNumber = _.sample( PLANET_NUMBER_POOL );
        this.generateFixedStar();
        this.generatePlants();

    },
    generateFixedStar:function(){
        this._fixedStars.push( new FixedStarModel({
            type: _.sample(FIXED_STAR_TYPES)
        }));
    },
    generatePlants:function(){
        var distance = 4;
        var distanceDiff = 3;

        var fixedStarType = this._fixedStars[0].get("type");
        if ( fixedStarType === FIXED_STAR_WHITE_DWARF ) {
            this.set("type",_.sample(["star-dwarf1","star-dwarf2"]));
        } else if ( fixedStarType === FIXED_STAR_RED_GIANT ) {
            this.set("type",_.sample(["star-giant1","star-giant2","star-giant3","star-giant4"]));
        } else if ( fixedStarType === FIXED_STAR_NORMAL ) {
            this.set("type",_.sample(["star-sun"]));
        }
        this._bestPlanet = this.generateBestPlant();
        this._planets.push(this._bestPlanet);

        /*for ( var i = 0; i < this._planetNumber; i++ ) {
            this._planets.push(new PlanetModel({
                distanceToSun: distance/10 + Math.round(Math.random()*30 - 15)/100,
                level: i
            }));
            distance = distanceDiff + 4;
            distanceDiff *= 2;
        }

        this._bestPlanet = _.max(this._planets,function(planetModel){
            return planetModel.get("maxPopulation");
        },this);*/
    },
    generateBestPlant:function(){
        var fixedStarType = this._fixedStars[0].get("type");
        if ( fixedStarType === FIXED_STAR_WHITE_DWARF ) {
            var planet = new PlanetModel({
                level : 1,
                distanceToSun: 0.4 + Math.round(Math.random()*30 - 15)/100,
                type: CORE_SOLID,
                temperature: TEMPERATURE_LOW,
                gravity: _.sample([GRAVITY_NORMAL, GRAVITY_LOW]),
                superficialArea: Math.round( (Math.random() * 0.5 + 0.5)*100 ) / 100,
                landCoverage: 1,
                atmosphere: _.sample([ATMOSPHERE_THIN, ATMOSPHERE_NORMAL]),
                atmosphericQuality: _.sample([ATMOSPHERE_NONE_POISON, ATMOSPHERE_LITTLE_POISON,ATMOSPHERE_LITTLE_POISON])
            });
            return planet;
        } else if ( fixedStarType === FIXED_STAR_RED_GIANT ) {
            var planet = new PlanetModel({
                level : 6,
                distanceToSun: 5.2 + Math.round(Math.random()*30 - 15)/100,
                type: CORE_GASEOUS,
                temperature: _.sample([TEMPERATURE_NORMAL, TEMPERATURE_HIGH]),
                gravity: _.sample([GRAVITY_NORMAL, GRAVITY_HIGH]),
                superficialArea: Math.round(Math.random()*20000)/100+500,
                airCoverage: 1,
                atmosphere: ATMOSPHERE_THICK,
                atmosphericQuality: _.sample([ATMOSPHERE_NONE_POISON, ATMOSPHERE_LITTLE_POISON,ATMOSPHERE_LITTLE_POISON])
            });
            return planet;
        } else if ( fixedStarType === FIXED_STAR_NORMAL ) {
            var temperature = _.sample([TEMPERATURE_NORMAL, TEMPERATURE_HIGH, TEMPERATURE_LOW]);
            var coverage;
            if ( temperature == TEMPERATURE_NORMAL ) {
                coverage = Math.random();
            } else coverage = 1;
            var planet = new PlanetModel({
                level : 3,
                distanceToSun: 1 + Math.round(Math.random()*30 - 15)/100,
                type: CORE_SOLID,
                temperature: temperature,
                gravity: _.sample([GRAVITY_NORMAL, GRAVITY_LOW]),
                superficialArea: Math.round(Math.random()*400)/100+2,
                landCoverage: coverage,
                seaCoverage: 1 - coverage,
                atmosphere: _.sample([GRAVITY_NORMAL, GRAVITY_LOW]),
                atmosphericQuality: _.sample([ATMOSPHERE_NONE_POISON, ATMOSPHERE_LITTLE_POISON,ATMOSPHERE_LITTLE_POISON])
            });

            return planet;
        }
    },
    colonize:function(colony){
        colony.starSystem = this;
        colony.planet = this._bestPlanet;
        this.colony = colony;
        this.setColonizing(null);
        gameModel.addColony(colony);
        this.trigger("colonized", this);
    }
});

var SunSystemModel = StarSystemModel.extend({
    generatePlants: function(){
        this._planetNumber = 9;

        this._planets.push(new PlanetModel({
            name: "水星",
            type: CORE_SOLID,
            distanceToSun: 0.387,

            displayTemperature: 452 - 273,
            temperature: TEMPERATURE_VERY_HIGH,

            displayGravity: 3.7/9.8, //重力：单位：G
            gravity: GRAVITY_LOW,

            atmosphere: ATMOSPHERE_NONE,

            waterQuality: WATER_NONE_POISON,
            superficialArea: 0.748,
            seaCoverage: 0,//水覆盖率
            landCoverage: 1//陆地覆盖率
        }));
        this._planets.push(new PlanetModel({
            name: "金星",
            type: CORE_SOLID,
            distanceToSun: 0.723,

            displayTemperature: 475,
            temperature: TEMPERATURE_VERY_HIGH,

            displayGravity: 8.78/9.8, //重力：单位：G
            gravity: GRAVITY_NORMAL,

            atmosphere: ATMOSPHERE_THICK,
            atmosphericQuality:ATMOSPHERE_LOTS_POISON,

            waterQuality: WATER_NONE_POISON,
            superficialArea: 4.6,
            seaCoverage: 0,//水覆盖率
            landCoverage: 1//陆地覆盖率
        }));
        var earth;
        this._planets.push(earth = new PlanetModel({
            name: "地球",
            type: CORE_SOLID,
            distanceToSun: 1,

            displayTemperature:14,
            temperature: TEMPERATURE_NORMAL,

            displayGravity: 1, //重力：单位：G
            gravity: GRAVITY_NORMAL,

            atmosphere: ATMOSPHERE_NORMAL,
            atmosphericQuality:ATMOSPHERE_NONE_POISON,

            waterQuality: WATER_NONE_POISON,

            superficialArea: 5.1,
            seaCoverage: 0.71,//水覆盖率
            landCoverage: 0.29//陆地覆盖率
        }));
        this._bestPlanet = earth;
        this._planets.push(new PlanetModel({
            name: "火星",
            type: CORE_SOLID,
            distanceToSun: 1.524,

            displayTemperature:-63,
            temperature: TEMPERATURE_LOW,

            displayGravity: 0.38, //重力：单位：G
            gravity: GRAVITY_LOW,

            atmosphere: ATMOSPHERE_THIN,
            atmosphericQuality:ATMOSPHERE_LITTLE_POISON,

            superficialArea: 1.44,
            seaCoverage: 0,//水覆盖率
            landCoverage: 1//陆地覆盖率
        }));
        this._planets.push(new PlanetModel({
            isAsteroid: true,
            name: "小行星带",
            type: CORE_SOLID,
            distanceToSun: 2.8
        }));
        this._planets.push(new PlanetModel({
            name: "木星",
            type: CORE_GASEOUS,
            distanceToSun: 5.203,

            displayTemperature: -168,
            temperature: TEMPERATURE_VERY_LOW,

            displayGravity: 23.12/9.8, //重力：单位：G
            gravity: GRAVITY_HIGH,

            atmosphere: ATMOSPHERE_THIN,
            atmosphericQuality:ATMOSPHERE_LOTS_POISON,

            superficialArea: 621.8,
            seaCoverage: 0,//水覆盖率
            landCoverage: 0,//陆地覆盖率
            airCoverage: 1
        }));
        this._planets.push(new PlanetModel({
            name: "土星",
            type: CORE_GASEOUS,
            distanceToSun: 9.539,

            displayTemperature: -178,
            temperature: TEMPERATURE_VERY_LOW,

            displayGravity: 12.5/9.8, //重力：单位：G
            gravity: GRAVITY_NORMAL,

            atmosphere: ATMOSPHERE_THIN,
            atmosphericQuality:ATMOSPHERE_LOTS_POISON,

            superficialArea: 457.15,
            seaCoverage: 0,//水覆盖率
            landCoverage: 0,//陆地覆盖率
            airCoverage: 1
        }));
        this._planets.push(new PlanetModel({
            name: "天王星",
            type: CORE_GASEOUS,
            distanceToSun: 19.191,

            displayTemperature: -180,
            temperature: TEMPERATURE_VERY_LOW,

            displayGravity: 8.69/9.8, //重力：单位：G
            gravity: GRAVITY_NORMAL,

            atmosphere: ATMOSPHERE_THIN,
            atmosphericQuality:ATMOSPHERE_LOTS_POISON,

            superficialArea: 81.156,
            seaCoverage: 0,//水覆盖率
            landCoverage: 0,//陆地覆盖率
            airCoverage: 1
        }));
        this._planets.push(new PlanetModel({
            distanceToSun: 30.071,
            name: "海王星",
            type: CORE_GASEOUS,

            displayTemperature: -214,
            temperature: TEMPERATURE_VERY_LOW,

            displayGravity: 11/9.8, //重力：单位：G
            gravity: GRAVITY_NORMAL,

            atmosphere: ATMOSPHERE_THIN,
            atmosphericQuality:ATMOSPHERE_LOTS_POISON,

            superficialArea: 81.156,
            seaCoverage: 0,//水覆盖率
            landCoverage: 0,//陆地覆盖率
            airCoverage: 1
        }));
    }
});

var FixedStarModel = Backbone.Model.extend({ //恒星
    defaults:function(){
        return {
            name: "",
            description: null, //描述
            size: "",
            type: FIXED_STAR_NORMAL //giant , nomarl, dwarf, 红巨星 白矮星 红矮星 脉冲星
        }
    }
})

var TEMPERATURE_VERY_LOW = 0;
var TEMPERATURE_LOW = 1;
var TEMPERATURE_NORMAL = 2;
var TEMPERATURE_HIGH = 3;
var TEMPERATURE_VERY_HIGH = 4;

var ATMOSPHERE_NONE = 1;
var ATMOSPHERE_THIN = 2;
var ATMOSPHERE_NORMAL = 3;
var ATMOSPHERE_THICK = 4;

var ATMOSPHERE_NONE_POISON = 0;
var ATMOSPHERE_LITTLE_POISON = 1;
var ATMOSPHERE_LOTS_POISON = 2;

var WATER_COVERAGE_NONE = 0;

var WATER_NONE_POISON = 0;
var WATER_LITTLE_POISON = 1;
var WATER_LOTS_POISON = 2;

var PlanetModel = Backbone.Model.extend({ //行星
    defaults:function(){
        return {
            name: "",
            description: null, //描述

            distanceToSun: 1, //平均距离 单位：天文单位

            type: 0, //gaseous  liquid solid

            displayTemperature:0, //温度
            temperature: TEMPERATURE_NORMAL, // 0: very cold, 1: cold: 2: normal; 3:hot; 4:very hot

            //orbitalPeriod: 1, //公转周期：高丝年
            displayGravity: 0, //重力：单位：G
            gravity: GRAVITY_NORMAL, // 0: very low; 1: low; 2: normal; 3: high; 4:very high

            //rotationPeriod: 1, //自转周期：标准天
            atmosphere: ATMOSPHERE_NORMAL, //none, thick ,normal, thin，无，薄，浓密
            atmosphericQuality:ATMOSPHERE_NONE_POISON,//大气成分

            waterQuality: WATER_NONE_POISON,

            superficialArea: 0, //亿平方公里 km²  1.44 火星
            seaCoverage: 0,//水覆盖率
            landCoverage: 0,//陆地覆盖率
            airCoverage: 0,

            colony: null
        };
    },
    initialize:function(){
        if ( this.get("type") ) {
            //预定义
        } else {
            var level = this.get("level");
            if ( level < 2 ) {
                this.set({
                    type: CORE_SOLID,
                    "temperature": TEMPERATURE_VERY_HIGH,
                    "gravity": _.sample([GRAVITY_LOW, GRAVITY_NORMAL]),
                    "superficialArea": Math.round( (Math.random() * 0.5 + 0.5)*100 ) / 100
                });
            } else if ( level < 4 ) {
                this.set({
                    type: CORE_SOLID,
                    "temperature": TEMPERATURE_HIGH,
                    "gravity": _.sample([GRAVITY_LOW, GRAVITY_NORMAL]),
                    "superficialArea": Math.round(Math.random()*200)/100+2
                });
            } else if ( level < 5 ) {
                this.set({
                    type: CORE_SOLID,
                    "temperature": TEMPERATURE_NORMAL,
                    "gravity": _.sample([GRAVITY_LOW, GRAVITY_NORMAL, GRAVITY_HIGH]),
                    "superficialArea": Math.round(Math.random()*200)/100+2
                });
            } else if ( level < 7 ) {
                this.set({
                    type: CORE_GASEOUS,
                    "temperature": TEMPERATURE_LOW,
                    "gravity": _.sample([GRAVITY_NORMAL, GRAVITY_HIGH]),
                    "superficialArea": Math.round(Math.random()*20000)/100+500
                });
            } else {
                this.set({
                    type: CORE_GASEOUS,
                    "temperature": TEMPERATURE_VERY_LOW,
                    "gravity": _.sample([GRAVITY_HIGH]),
                    "superficialArea": Math.round(Math.random()*2000)/100+80
                });
            }

            if (this.get("type") == CORE_GASEOUS) {
                this.set("airCoverage", 1);
                this.set("atmosphere",ATMOSPHERE_THICK);
                this.set("atmosphericQuality", _.sample([ATMOSPHERE_NONE_POISON, ATMOSPHERE_LITTLE_POISON,ATMOSPHERE_LITTLE_POISON, ATMOSPHERE_LOTS_POISON, ATMOSPHERE_LOTS_POISON]));
            } else if (this.get("type") == CORE_SOLID) {
                var coverage;
                if ( this.get("temperature") == TEMPERATURE_NORMAL ) {
                    coverage = Math.random();
                } else coverage = 1;
                this.set("landCoverage", coverage);
                this.set("seaCoverage", 1 - coverage);
                this.set("atmosphere", _.sample([ATMOSPHERE_NONE,ATMOSPHERE_THIN,ATMOSPHERE_NORMAL,ATMOSPHERE_THICK]));
                this.set("atmosphericQuality", _.sample([ATMOSPHERE_NONE_POISON, ATMOSPHERE_LITTLE_POISON, ATMOSPHERE_LOTS_POISON]));
                if ( this.get("seaCoverage") ) this.set("waterQuality", _.sample([WATER_NONE_POISON, WATER_LITTLE_POISON, WATER_LOTS_POISON]));
            }
        }

        if ( this.get("displayTemperature") == 0 ) {
            switch ( this.get("temperature") ) {
                case TEMPERATURE_VERY_LOW:
                    this.set("displayTemperature", Math.random()*100-250 );
                    break;
                case TEMPERATURE_LOW:
                    this.set("displayTemperature",  Math.random()*40-100 );
                    break;
                case TEMPERATURE_NORMAL:
                    this.set("displayTemperature", Math.random()*40 );
                    break;
                case TEMPERATURE_HIGH:
                    this.set("displayTemperature", Math.random()*30+70 );
                    break;
                case TEMPERATURE_VERY_HIGH:
                    this.set("displayTemperature", Math.random() * 80 + 120 );
                    break;
            }
        }

        if ( this.get("displayGravity") == 0 ) {
            switch ( this.get("gravity") ) {
                case GRAVITY_LOW:
                    this.set("displayGravity", 0.4 + Math.round(Math.random()*40)/100 );
                    break;
                case GRAVITY_NORMAL:
                    this.set("displayGravity", 0.8 + Math.round(Math.random()*40)/100 );
                    break;
                case GRAVITY_HIGH:
                    this.set("displayGravity", 1.5 + Math.round(Math.random()*100)/100 );
                    break;
                case GRAVITY_VERY_HIGH:
                    this.set("displayGravity", 3 + Math.round(Math.random()*40)/100 );
                    break;
            }
        }

        this.set("landSuperficialArea", this.get("superficialArea")*this.get("landCoverage"));
        this.set("seaSuperficialArea", this.get("superficialArea")*this.get("seaCoverage"));
        this.set("airSuperficialArea", this.get("superficialArea")*this.get("airCoverage"));

        var landUsage = 800000;
        var seaUsage = 0;
        var airUsage = 0;

        var penalty = 0;
//temperature penalty
        var temperature = this.get("temperature");
        if ( temperature == TEMPERATURE_VERY_LOW || temperature == TEMPERATURE_VERY_HIGH ) {
            penalty += 1;
        } else if ( temperature == TEMPERATURE_LOW || temperature == TEMPERATURE_HIGH ) {
            penalty += 0.3;
        }
//gravity penalty
        var gravity = this.get("gravity");
        if ( gravity == GRAVITY_VERY_HIGH ) {
            penalty += 1;
        } else if ( gravity == GRAVITY_HIGH ) {
            penalty += 0.3;
        }
//atmosphere penalty
        var atmosphere = this.get("atmosphere");
        if ( atmosphere == ATMOSPHERE_NONE ) {
            penalty += 1;
        } else if ( atmosphere == ATMOSPHERE_THIN ) {
            penalty += 0.3;
        }

        var atmosphericQuality = this.get("atmosphericQuality");
        if ( atmosphericQuality === ATMOSPHERE_LITTLE_POISON ) {
            penalty += 0.2;
        } else if ( atmosphericQuality === ATMOSPHERE_LOTS_POISON ) {
            penalty = 1;
        }
////waterQuality penalty
//        var waterQuality = this.get("waterQuality");
//        if ( waterQuality === WATER_LITTLE_POISON ) {
//            seaUsage /= 4;
//        } else if ( atmosphericQuality === WATER_LOTS_POISON ) {
//            seaUsage = 0;
//        }

        this.set("landUsage", landUsage );
        this.set("seaUsage", seaUsage);
        this.set("airUsage", airUsage);
        this.set("penalty", penalty);

        this.calSupportPopulation();

        this.on("change:landUsage,change:seaUsage,change:airUsage",this.calSupportPopulation, this);
    },
    calSupportPopulation:function(){
        var penalty = this.get("penalty")
        var discount = 1 - Math.min(1, penalty);
        var maxPopulation = this.get("landSuperficialArea")*this.get("landUsage")*discount +
            this.get("seaSuperficialArea")*this.get("seaUsage")*discount +
            this.get("airSuperficialArea")*this.get("airUsage")*discount;

        this.set("maxPopulation", Math.max(maxPopulation, 120) );

        if ( maxPopulation > 10000000 ) {
            cc.log(this);
        }
    }
})
