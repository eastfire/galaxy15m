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
        name = STAR_SYSTEM_ORDER[currentCount]+turn + name+"座";
    } else {
        name = STAR_SYSTEM_ORDER[currentCount]+ name+"座";
    }
    return name;
}

var StarSystemModel = Backbone.Model.extend({
    defaults:function(){
        return {
            name: null,
            x: 0,
            y: 0,
            fixedStar: [],
            planet: []
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
    colonize:function(colony){
        colony.starSystem = this;
        this.colony = colony;
        this.setColonizing(null);
        gameModel.addColony(colony);
        this.trigger("colonized", this);
    }
});

var StarModel = Backbone.Model.extend({
    defaults:function(){
        return {
            name: "earth",
            description: null //描述
        }
    }
})

var FixedStarModel = StarModel.extend({ //恒星
    defaults:function(){
        return _.extend( StarModel.prototype.defaults.call(this), {
            size: "",
            type: "", //红巨星 白矮星 红矮星 脉冲星
            dysonRing: false,
            dysonSphere: false
        })
    }
})

var CORE_GASEOUS = 0;
var CORE_LIQUID = 1;
var CORE_SOLID = 2;

var ATMOSPHERE_NONE = 0;
var ATMOSPHERE_THIN = 1;
var ATMOSPHERE_THICK = 2;

var ATMOSPHERE_NONE_POISON = 0;
var ATMOSPHERE_LITTLE_POISON = 1;
var ATMOSPHERE_LOTS_POISON = 2;

var WATER_COVERAGE_NONE = 0;

var WATER_NONE_POISON = 0;
var WATER_LITTLE_POISON = 1;
var WATER_LOTS_POISON = 2;

var PlanetModel = StarModel.extend({ //行星
    defaults:function(){
        return _.extend( StarModel.prototype.defaults.call(this),{
            distanceToSun: 1, //平均距离 单位：天文单位

            minTemperature: 0,
            maxTemperature: 0,

            //orbitalPeriod: 1, //公转周期：高丝年
            gravity: 1, //重力：单位：G
            core: CORE_SOLID, //gaseous  liquid solid

            //rotationPeriod: 1, //自转周期：标准天
            atmosphere: ATMOSPHERE_NONE, //none, thick ,thin，无，薄，浓密
            atmosphericQuality:ATMOSPHERE_NONE_POISON,//大气成分

            waterCoverage: 0,//水覆盖率
            waterQuality: WATER_NONE_POISON,

            landCoverage: 0,//陆地覆盖率

            habitableZone: 0,

            environment: 1,

            colony: null
        })
    },
    evaluateColonizeSuccessRate:function(){

    },
    evaluateColony:function(){
        var colony = this.get("colony");
        if ( colony ) {
            colony.evaluteStatus( this );
        }
    }
})

var AsteroidBeltModel = StarModel.extend({ //行星
    defaults:function(){
        return {
            distanceToSun: 1, //距离 单位：天文单位
            facility: null
        }
    }
})