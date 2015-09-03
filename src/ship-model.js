var SHIP_NAME_POOL = [ "阿西莫夫","克拉克","海因莱因","凡尔纳","赫胥黎","威尔斯","奥威尔","马丁","尼文","文奇",
    "卡德","刘","西蒙斯","泽拉兹尼","亚当斯","蒂利","吉布森","摩根","斯蒂芬森","迪克","布林","斯卡尔齐","索耶","雪莱",
    "斯特鲁伽茨基","扎米亚金",
    "勒奎恩","凯斯","姜","金","哈里森","西尔弗伯格","布鲁梭罗","安德森","贝尔","布拉德伯里","霍尔德曼","摩根","乔克","贝斯特",
    "巴奇加卢皮",
    "筒井","山田","小松","小川","小林"];

var shipNameGenerated;
var generateShipTitle=function() {
    var name;
    if ( shipNameGenerated === undefined ) {
        shipNameGenerated = {};
        name = SHIP_NAME_POOL[0];
    } else {
        name = _.sample(SHIP_NAME_POOL);
    }
    if ( shipNameGenerated[name] ) {
        var count = ++shipNameGenerated[name];
        name += count+"号"
    } else {
        shipNameGenerated[name] = 1;
        name += "号"
    }
    return name;
}

var ShipModel = Backbone.Model.extend({
    defaults:function(){
        return {
            name: null,
            x: 0,
            y: 0,
            speed: 0.001, //单位 光速
            population: 1, //单位万
            type: "generation", //generation, sleep,

            successRate: 0
        }
    },
    initialize:function(){
        var typeStr;
        this.set("speed", gameModel.get("shipSpeed"));
        this.set("name", generateShipTitle());
    },
    evaluate:function(){

    },
    evaluateColonize:function(){
        if ( this.to.isColonized() ) {
            this.to.set("population",this.to.get("population")+this.get("population"));
            this.to.setColonizing(null);
            return false;
        }

        var success = true;

        if ( success ) {
            colony = new ColonyModel({
                name : generateColonyName(),
                population: this.get("population")
            });
            this.to.colonize(colony);
        }
        return success;
    }
});