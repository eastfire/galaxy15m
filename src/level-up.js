/**
 * Created by 赢潮 on 2015/8/3.
 */
var typeFrame = [
    "icon-type-atomic.png",
    "icon-type-dna.png",
    "icon-type-mind.png",
    "icon-type-mechanical.png"
];

var TechLayer = cc.LayerColor.extend({
    ctor:function(options){
        this._super(cc.color.BLACK);
        this.options = options || {};
        this.model = this.options.model;

        var closeItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("back-default.png"),
            cc.spriteFrameCache.getSpriteFrame("back-press.png"),
            function () {
                cc.director.popScene();
            }, this);
        closeItem.attr({
            x: 25,
            y: cc.winSize.height - 25,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu([closeItem]);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, UI_Z_INDEX);

        var scienceIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icon-science.png"));
        scienceIcon.attr({
            x: 70,
            y: cc.winSize.height - 25
        });
        this.addChild(scienceIcon);

        this.scienceLabel = new ccui.Text("123", "Arial", dimens.top_bar_label );
        this.scienceLabel.enableOutline(cc.color.WHITE, 3);
        this.scienceLabel.setTextColor(colors.science_value);
        this.scienceLabel.attr({
            x: 50,
            y: 20,
            anchorX: 0,
            anchorY: 0.5
        })
        scienceIcon.addChild(this.scienceLabel);

        this.renderScience();

        this.renderPyramid();

        this.currentSelectTechSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("select-tech.png"));
    },
    onEnter:function(){
        this.model.on("change:science",this.renderScience,this);
        this._super();
    },
    onExit:function(){
        this.model.off("change:science",this.renderScience,this);
        this._super();
    },
    renderScience:function(){
        this.scienceLabel.setString(Math.floor(this.model.get("science")));
    },
    renderPyramid:function(){
        //remove all view
        if ( this.menu ) this.menu.removeFromParent(true);
        var padding = 10;
        var pyramidWidth = cc.winSize.width - 300 - padding*2;
        var pyramidHeight = cc.winSize.height - padding*2;
        var maxTechLevel = this.model.get("maxTechLevel");
        var maxLevelOneTech = this.model.get("maxLevelOneTech");
        var techWidth1 = Math.floor(pyramidHeight / maxTechLevel);
        var techWidth2 = Math.floor(pyramidWidth / maxLevelOneTech);
        var techWidth = techWidth1 > techWidth2 ? techWidth2 : techWidth1;
        var paddingX = ( cc.winSize.width - 300 - techWidth * maxLevelOneTech ) / 2;
        var paddingY = ( cc.winSize.height - techWidth * maxTechLevel ) / 2;
        var starX = techWidth/2 + paddingX;
        var techHeight = techWidth;
        var currentY = techWidth/2 + paddingY;
        var currentX = starX;
        var scale = (techWidth-5) / 96;
        var level = 0;
        var items = [];


        _.each(this.model._tech,function(tier){
            _.each(tier,function(techModel){
                this.pushCurrentTechItem(currentX, currentY, techModel, items, level, scale);
                currentX += techWidth;
            },this);

            if ( ( level == 0 && this.model._tech[0].length < maxLevelOneTech ) || ( level >= 1 && this.model._tech[level].length < this.model._tech[level-1].length - 1 ) ) {
                this.pushAddTechItem(currentX, currentY, level, items, scale);
            }

            level ++;
            currentX = starX + level*(techWidth/2);
            currentY += techHeight;
        },this);
        if ( this.model._tech.length == 0 ) {
            this.pushAddTechItem(currentX,currentY,0,items, scale);
        } else if ( this.model._tech[this.model._tech.length-1].length >= 2 && this.model._tech.length<maxTechLevel ){
            this.pushAddTechItem(currentX,currentY,level,items, scale);
        }

        this.menu = new cc.Menu(items);
        this.menu.x = 0;
        this.menu.y = 0;
        this.addChild(this.menu);
    },
    pushCurrentTechItem:function(currentX, currentY,techModel, items, level, scale){
        var name = techModel.get("name");
        var currentTechItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("tech-"+name+".png"),
            cc.spriteFrameCache.getSpriteFrame("tech-"+name+".png"),
            function () {
                this.onClickTech(techModel, level, currentX, currentY, scale);
            }, this);
        currentTechItem.attr({
            x: currentX,
            y: currentY,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: scale,
            scaleY: scale
        });
        items.push(currentTechItem);

        this.renderTechTypes(techModel, currentTechItem, 16,16, 0.5, 30);

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
    pushAddTechItem:function(currentX, currentY, level, items, scale) {
        var addTechItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("add-tech-default.png"),
            cc.spriteFrameCache.getSpriteFrame("add-tech-press.png"),
            function () {
                this.onAddTech(level);
            }, this);
        addTechItem.attr({
            x: currentX,
            y: currentY,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: scale,
            scaleY: scale
        });
        items.push(addTechItem);
    },
    onClickTech:function(techModel, level,x, y, scale){
        this.currentSelectTechSprite.x = x;
        this.currentSelectTechSprite.y = y;
        this.currentSelectTechSprite.scaleX = scale;
        this.currentSelectTechSprite.scaleY = scale;
        this.currentSelectTechSprite.removeFromParent();
        if ( gameModel.hasTech(techModel) ) {
            this.addChild(this.currentSelectTechSprite,100);
        } else {
            this.techListBg.addChild(this.currentSelectTechSprite,100);
        }
        this.showTechDetail(techModel, level, null, null);
    },
    showTechDetail:function(techModel,level, callback,context){
        if ( this.currentShowingTechModel === techModel ) return;
        var cost;
        if ( !this.model.hasTech(techModel) ) {
            cost = techModel.getCost(level, this.model.techCount(level));
        }

        this.currentShowingTechModel = techModel;
        var techDetailBgWidth = 300;
        var techDetailBgHeight = cc.winSize.height;
        var offsetX = techDetailBgWidth - 16;
        if ( this.techDetailBg ) {
            var tempBg = this.techDetailBg;
            tempBg.runAction(cc.sequence(cc.moveBy(times.show_tech_detail, offsetX, 0),
                cc.callFunc(function(){
                    tempBg.removeFromParent();
                },this)));
        }
        this.techDetailBg = new cc.Scale9Sprite(cc.spriteFrameCache.getSpriteFrame("button-bg-default.png"));
        this.techDetailBg.x = cc.winSize.width+techDetailBgWidth/2;
        this.techDetailBg.y = cc.winSize.height/2;
        this.techDetailBg.width = techDetailBgWidth;
        this.techDetailBg.height = techDetailBgHeight;

        this.addChild(this.techDetailBg,UI_Z_INDEX);

        var name = techModel.get("name");
        var techIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("tech-"+name+".png"));
        techIcon.attr({
            x: 60,
            y: techDetailBgHeight - 60
        });
        this.techDetailBg.addChild(techIcon);

        var techNameLabel = new cc.LabelTTF(techModel.get("displayName"), null, dimens.tech_detail_tech_name);
        techNameLabel.attr({
            color: colors.tech_detail_tech_name,
            x: 120,
            y: techDetailBgHeight - 30,
            anchorX: 0,
            anchorY: 0.5,
            textAlign:cc.TEXT_ALIGNMENT_LEFT
        });
        this.techDetailBg.addChild(techNameLabel);

        this.renderTechTypes(techModel, this.techDetailBg, 140,techDetailBgHeight - 70, 1, 55);

        var techDescriptionLabel = new cc.LabelTTF(techModel.getDescription(), null, dimens.tech_detail_tech_description);
        var y = techDetailBgHeight - 120;
        techDescriptionLabel.attr({
            color: colors.tech_detail_tech_description,
            x: 20,
            y: y,
            anchorX: 0,
            anchorY: 1,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            verticalAlign:cc.VERTICAL_TEXT_ALIGNMENT_TOP,
            boundingWidth: 260
        });
        this.techDetailBg.addChild(techDescriptionLabel);
        y -= techDescriptionLabel.getContentSize().height + 0

        var discountPerMatch = gameModel.get("discountPerMatch");
        var leftMatch = techModel.get("leftMatch");
        if ( leftMatch ) {
            str = "左侧基础奖励：{[icon-science-small]}需求-"+Math.round(leftMatch*discountPerMatch*100)+"%"
            var discountLabel = buildRichText({
                str : str,
                fontSize : dimens.tech_detail_tech_description,
                fontColor: colors.tech_detail_tech_description,
                width: 240,
                height: 20
            });
            discountLabel.attr({
                anchorX: 0.5,
                anchorY : 1,
                x: techDetailBgWidth/2,
                y: y + 10
            });
            this.techDetailBg.addChild(discountLabel);
            y -= 30;
        }
        var rightMatch = techModel.get("rightMatch");
        if ( rightMatch ) {
            str = "右侧基础奖励：{[icon-science-small]}需求-"+Math.round(rightMatch*discountPerMatch*100)+"%"
            var discountLabel = buildRichText({
                str : str,
                fontSize : dimens.tech_detail_tech_description,
                fontColor: colors.tech_detail_tech_description,
                width: 240,
                height: 20
            });
            discountLabel.attr({
                anchorX: 0.5,
                anchorY : 1,
                x: techDetailBgWidth/2,
                y: y + 10
            });
            this.techDetailBg.addChild(discountLabel);
            y -= 30;
        }

        var flavor = techModel.get("flavor");
        if ( flavor ) {
            var techFlavorLabel = new cc.LabelTTF(flavor, null, dimens.tech_detail_tech_flavor);
            techFlavorLabel.attr({
                color: colors.tech_detail_tech_flavor,
                x: 20,
                y: y ,
                anchorX: 0,
                anchorY: 1,
                textAlign: cc.TEXT_ALIGNMENT_LEFT,
                verticalAlign: cc.VERTICAL_TEXT_ALIGNMENT_TOP,
                boundingWidth: 260,
                boundingHeight: 150
            });
            this.techDetailBg.addChild(techFlavorLabel);
        }

        this.techDetailBg.runAction(cc.moveBy(times.show_tech_detail, -offsetX, 0));

        var buttonItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("button-long-default.png"),
            cc.spriteFrameCache.getSpriteFrame("button-long-press.png"),
            function () {
                if ( !this.model.hasTech(techModel) ) {
                    var cost = techModel.getCost(level, this.model.techCount(level));
                    if ( cost > this.model.get("science") ) return; //无法支付
                    this.model.getTech(level, techModel, cost);
                    this.hideTechList();
                    this.renderPyramid();
                    if ( callback ) callback.call(context);
                }
                var tempBg = this.techDetailBg;
                this.techDetailBg = null;
                this.currentShowingTechModel = null;
                tempBg.runAction(cc.sequence(cc.moveBy(times.show_tech_detail, offsetX, 0),
                    cc.callFunc(function(){
                        tempBg.removeFromParent();
                    },this)));
            }, this);
        buttonItem.attr({
            x: techDetailBgWidth/2-7,
            y: 30
        });

        if ( this.model.hasTech(techModel) ) {
            var okLabel = new cc.LabelTTF(texts.confirm, null, dimens.tech_detail_tech_name);
            okLabel.attr({
                color: colors.tech_detail_research,
                x: 100,
                y: 20,
                anchorX: 0.5,
                anchorY: 0.5
            });
            buttonItem.addChild(okLabel);
        } else {
            var str = 0;
            if ( cost <= this.model.get("science") ) {
                str = "支付"+cost+"{[icon-science-small]}研发";
            } else {
                str = "无法支付"+cost+"{[icon-science-small]}";
            }
            var searchLabel = buildRichText({
                str : str,
                fontSize : dimens.tech_detail_research,
                fontColor: colors.tech_detail_research,
                width: 135,
                height: 40
            });
            searchLabel.attr({
                x: 95,
                y: 16,
                anchorX: 0.5
            });
            buttonItem.addChild(searchLabel);
        }
        var menu = new cc.Menu(buttonItem);
        menu.x = 0;
        menu.y = 0;
        this.techDetailBg.addChild(menu, UI_Z_INDEX);
    },
    onAddTech:function(level){
        this.showTechList(level);
    },
    hideTechList:function(){
        if ( this.techListBg ) {
            var tempBg = this.techListBg;
            tempBg.runAction(cc.sequence(cc.moveBy(times.show_tech_detail, - 530 + 16, 0),
                cc.callFunc(function(){
                    tempBg.removeFromParent();
                },this)
            ));
            this.techListBg = null;
        }
    },
    showTechList:function(level){
        var techListBgWidth = 530;
        var techListBgHeight = cc.winSize.height;
        var offsetX = - techListBgWidth + 16;
        this.techListBg = new cc.Scale9Sprite(cc.spriteFrameCache.getSpriteFrame("button-bg-default.png"));
        this.techListBg.x = -techListBgWidth/2;
        this.techListBg.y = techListBgHeight/2;
        this.techListBg.width = techListBgWidth;
        this.techListBg.height = techListBgHeight;

        this.addChild(this.techListBg,UI_Z_INDEX);
        var items = [];
        var closeItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("back-default.png"),
            cc.spriteFrameCache.getSpriteFrame("back-press.png"),
            function () {
                this.hideTechList();
            }, this);
        closeItem.attr({
            x: 25+26,
            y: cc.winSize.height - 28,
            anchorX: 0.5,
            anchorY: 0.5
        });
        items.push(closeItem);

        var scienceIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icon-science.png"));
        scienceIcon.attr({
            x: 70+26,
            y: cc.winSize.height - 28
        });
        this.techListBg.addChild(scienceIcon);

        var scienceLabel = new ccui.Text(Math.floor(this.model.get("science")), "Arial", dimens.top_bar_label );
        scienceLabel.enableOutline(cc.color.WHITE, 3);
        scienceLabel.setTextColor(colors.science_value);
        scienceLabel.attr({
            x: 50,
            y: 20,
            anchorX: 0,
            anchorY: 0.5
        })
        scienceIcon.addChild(scienceLabel);


        this.techListBg.runAction(cc.moveBy(times.show_tech_detail, -offsetX, 0));
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        }), this.techListBg);

        //render techs
        var currentY = techListBgHeight - 100;
        var startX = 70;
        var currentX = startX;
        var techWidth = 100;
        var techHeight = 90;
        _.each(this.model._availableTech[level],function(techModel){
            this.pushCurrentTechItem(currentX, currentY, techModel, items, level, 0.9);
            currentX += techWidth;
            if ( currentX + techWidth/2 > techListBgWidth ) {
                currentX = startX;
                currentY -= techHeight;
            }
        },this);

        this.menu = new cc.Menu(items);
        this.menu.x = 0;
        this.menu.y = 0;
        this.techListBg.addChild(this.menu);
    }
});

var TechScene = cc.Scene.extend({
    ctor:function(options){
        this._super();
        this.options = options || {};
    },
    onEnter:function () {
        this._super();
        var layer = new TechLayer(this.options);
        this.addChild(layer);
    }
});