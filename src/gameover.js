/**
 * Created by 赢潮 on 2015/8/2.
 */
var GameOverLayer = cc.Layer.extend({
    ctor:function(options){
        this._super();
        this.options = options || {};
        var label = new cc.LabelTTF("恭喜！", null, dimens.congratulation);
        label.attr({
            color: colors.gameover,
            x: cc.winSize.width/2,
            y: cc.winSize.height-100,
            anchorX: 0.5,
            anchorY: 0.5
        })
        this.addChild(label);

        //check occupy
        var colonized = options.model.getColonizedStarSystems().length;
        var all = options.model.getAllStarSystems().length;

        var str = "人类用"+Math.round(options.model.get("year")-START_YEAR)+"年占领了银河系"+( colonized >= all ? "所有" : (Math.floor(colonized/all*100)+"%") )+"的星系"
        label = new cc.LabelTTF(str, null, 25);
        label.attr({
            color: colors.gameover,
            x: cc.winSize.width/2,
            y: cc.winSize.height-200,
            anchorX: 0.5,
            anchorY: 0.5
        })
        this.addChild(label);

        str = "你的得分:"+options.model.get("score");
        label = new cc.LabelTTF(str, null, 25 );
        label.attr({
            color: colors.gameover,
            x: cc.winSize.width/2,
            y: cc.winSize.height-300,
            anchorX: 0.5,
            anchorY: 0.5
        })
        this.addChild(label);
    }

});

var GameOverScene = cc.Scene.extend({
    ctor:function(options){
        this._super();
        this.options = options || {};
    },
    onEnter:function () {
        this._super();
        var layer = new GameOverLayer(this.options);
        this.addChild(layer);
    }
});