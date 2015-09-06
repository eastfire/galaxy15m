/**
 * Created by 赢潮 on 2015/8/24.
 */
var ModalDialogLayer = cc.Layer.extend({
    ctor:function(options) {
        this._super();
        var oldScale = options.scene.scheduler.getTimeScale();
        options.scene.scheduler.setTimeScale(0);
        blockAllTouchEvent(this);

        var dialogBg = new cc.Scale9Sprite(cc.spriteFrameCache.getSpriteFrame("button-bg-default.png"));
        dialogBg.x = cc.winSize.width/2;
        dialogBg.y = cc.winSize.height/2;
        dialogBg.width = 480;
        dialogBg.height = 360;

        this.dialogBg = dialogBg;

        this.addChild(dialogBg);

        var label = new cc.LabelTTF(options.text, null, dimens.top_bar_label);
        label.attr({
            color: colors.dialog_label,
            x: dialogBg.width/2,
            y: dialogBg.height/3*2,
            anchorX: 0.5,
            anchorY: 0.5,
            textAlign:cc.TEXT_ALIGNMENT_CENTER,
            width: dialogBg.width*2,
            height: dialogBg.height/3
        });
        dialogBg.addChild(label);

        var self = this;
        var closeDialog = function(){
            self.removeFromParent(true);
            options.scene.scheduler.setTimeScale(oldScale);
            if (options.callback) options.callback.call(options.context);
        }
        var closeItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("close-default.png"),
            cc.spriteFrameCache.getSpriteFrame("close-press.png"),
            function () {
                closeDialog()
            }, this);
        closeItem.attr({
            x: dialogBg.width - 25,
            y: dialogBg.height - 25,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var okItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("button-short-default.png"),
            cc.spriteFrameCache.getSpriteFrame("button-short-press.png"),
            function () {
                closeDialog();
            }, this);
        okItem.attr({
            x: dialogBg.width /2,
            y: 35,
            anchorX: 0.5,
            anchorY: 0.5
        });
        var okLabel = new cc.LabelTTF(texts.confirm, null, 25 );
        okLabel.attr({
            color: colors.tech_detail_research,
            x: 59,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });
        okItem.addChild(okLabel);

        var menu = new cc.Menu([closeItem, okItem]);
        menu.x = 0;
        menu.y = 0;
        dialogBg.addChild(menu);
    }
});

var showModalDialog = function(scene, text, callback, context) {
    var layer;
    scene.addChild(layer = new ModalDialogLayer({
        scene: scene,
        text:text,
        callback: callback,
        context: context
    }), 200);
    return layer.dialogBg;
}