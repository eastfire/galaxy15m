/**
 * Created by 赢潮 on 2015/8/25.
 */
var MultiverseTechLayer = cc.Layer.extend({
    ctor:function(options){
        this._super();

        this.model = options.model;

        var self = this;
        var dialogBg = new cc.Scale9Sprite(cc.spriteFrameCache.getSpriteFrame("button-bg-default.png"));
        dialogBg.x = cc.winSize.width/2;
        dialogBg.y = cc.winSize.height/2;
        dialogBg.width = 640;
        dialogBg.height = 400;

        this.addChild(dialogBg,1);
        var currentSelectTechForNextGame = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("select-tech.png"));
        currentSelectTechForNextGame.attr({
            scaleX: 0.9,
            scaleY: 0.9
        });

        var label = new cc.LabelTTF(texts.please_choose_tech_for_next_game, null, dimens.top_bar_label);
        label.attr({
            color: colors.dialog_label,
            x: dialogBg.width/2,
            y: dialogBg.height - 40,
            anchorX: 0.5,
            anchorY: 0.5,
            textAlign:cc.TEXT_ALIGNMENT_CENTER
        });
        dialogBg.addChild(label);

        var items = [];
        //render techs
        var currentY = dialogBg.height - 100;
        var startX = 70;
        var currentX = startX;
        var techWidth = 100;
        var techHeight = 100;
        var list = _.union(this.model._tech[0],this.model._tech[1]);
        _.each(list,function(techModel){
            (function( techModel, currentX, currentY) {
                var name = techModel.get("name");
                var currentTechItem = new cc.MenuItemImage(
                    cc.spriteFrameCache.getSpriteFrame("tech-" + name + ".png"),
                    cc.spriteFrameCache.getSpriteFrame("tech-" + name + ".png"),
                    function () {
                        if (currentSelectTechForNextGame.parent == dialogBg) {
                            currentSelectTechForNextGame.stopAllActions();
                            currentSelectTechForNextGame.runAction(new cc.moveTo(0.3, currentX, currentY))
                        } else {
                            currentSelectTechForNextGame.x = currentX;
                            currentSelectTechForNextGame.y = currentY;
                            dialogBg.addChild(currentSelectTechForNextGame);
                        }
                        selectedTechModel = techModel;

                    }, this);
                currentTechItem.attr({
                    x: currentX,
                    y: currentY,
                    anchorX: 0.5,
                    anchorY: 0.5,
                    scaleX: 0.9,
                    scaleY: 0.9
                });
                items.push(currentTechItem);

                this.renderTechTypes(techModel, currentTechItem, 16,16, 0.5, 30);
            }).call(this, techModel, currentX, currentY);

            currentX += techWidth;
            if ( currentX + techWidth/2 > dialogBg.width ) {
                currentX = startX;
                currentY -= techHeight;
            }
        },this);

        var selectedTechModel = null;
        var okItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("button-short-default.png"),
            cc.spriteFrameCache.getSpriteFrame("button-short-press.png"),
            function () {
                if ( selectedTechModel ) {
                    var name = selectedTechModel.get("name");
                    cc.log("save "+name);
                    cc.sys.localStorage.setItem("savedTech",name);
                    this.closeDialog();
                }
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
        items.push(okItem);

        var menu = new cc.Menu(items);
        menu.x = 0;
        menu.y = 0;
        dialogBg.addChild(menu);
    },
    renderTechTypes:function(techModel, mainSprite, x, y, scale, stepX ) {
        _.each(techModel.get("types"),function(type){
            var typeSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(typeFrame[type]));
            typeSprite.attr({
                x:x,
                y:y,
                scaleX: scale,
                scaleY: scale
            });
            x += stepX;
            mainSprite.addChild(typeSprite);
        });
    },
    closeDialog : function(){
        cc.director.runScene( new GameOverScene({model:this.model}) );
    }
});

var MultiverseTechScene = cc.Scene.extend({
    ctor:function(options){
        this._super();
        this.options = options || {};
    },
    onEnter:function () {
        this._super();
        var layer = new MultiverseTechLayer(this.options);
        this.addChild(layer);
    }
});