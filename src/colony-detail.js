/**
 * Created by 赢潮 on 2015/8/24.
 */
var ColonyDetailSprite = cc.Scale9Sprite.extend({
    show:function(){
        this.stopAllActions();
        this.runAction(cc.moveTo(times.show_tech_detail, this.x < 0 ?
            this.width/2 : cc.winSize.width-this.width/2, cc.winSize.height/2+10));
    },
    close:function(){
        this.model.off(this);
        if ( this.callback ) this.callback.call(this.context);
        this.stopAllActions();
        this.runAction(cc.sequence(cc.moveBy(times.show_tech_detail, this.x < cc.winSize.width/2 ? -this.offset : this.offset , 0),
            cc.callFunc(function(){
                this.removeFromParent();

            },this)));
    },
    ctor:function(options){
        this._super(cc.spriteFrameCache.getSpriteFrame("button-bg-default.png"));
        var targetX = options.x;
        this.callback = options.callback;
        this.context = options.context;
        this.model = options.model;

        var colonyDetailBgWidth = 300;
        var colonyDetailBgHeight = cc.winSize.height - 80;
        this.offset = colonyDetailBgWidth;

        this.attr({
            width: colonyDetailBgWidth,
            height: colonyDetailBgHeight,
            y: cc.winSize.height/2 + 10
        });

        if ( targetX > cc.winSize.width - colonyDetailBgWidth - 50 ) {
            this.x = -colonyDetailBgWidth/2;
        } else {
            this.x = cc.winSize.width+colonyDetailBgWidth/2;
        }
        blockMyTouchEvent(this);

        var lineHeight = 25;
        var y = colonyDetailBgHeight-30;
        var nameLabel = new cc.LabelTTF(this.model.get("name"), null, dimens.colony_detail_name);
        nameLabel.attr({
            color: colors.colony_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(nameLabel);
        y -= lineHeight;

        this.disasterLabel = new cc.LabelTTF("", null, dimens.colony_label);
        this.disasterLabel.attr({
            color: colors.colony_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        });
        this.addChild(this.disasterLabel);
        y -= lineHeight;

        this.populationLabel = new cc.LabelTTF("", null, dimens.colony_label);
        this.populationLabel.attr({
            color: colors.log_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(this.populationLabel);
        y -= lineHeight;

        this.maxPopulationLabel = new cc.LabelTTF("", null, dimens.colony_label);
        this.maxPopulationLabel.attr({
            color: colors.log_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(this.maxPopulationLabel);
        y -= lineHeight;

        this.populationGrowLabel = new cc.LabelTTF("", null, dimens.colony_label);
        this.populationGrowLabel.attr({
            color: colors.log_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(this.populationGrowLabel);
        y -= lineHeight;

        this.launchRateLabel = new cc.LabelTTF("", null, dimens.colony_label);
        this.launchRateLabel.attr({
            color: colors.log_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(this.launchRateLabel);
        y -= lineHeight;

        this.scienceRateLabel = new cc.LabelTTF("", null, dimens.colony_label);
        this.scienceRateLabel.attr({
            color: colors.log_label,
            x: 30,
            y:y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(this.scienceRateLabel);
        y -= lineHeight;

        var items = [];
        var closeItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("close-default.png"),
            cc.spriteFrameCache.getSpriteFrame("close-press.png"),
            this.close, this);
        closeItem.attr({
            x: colonyDetailBgWidth - 25,
            y: colonyDetailBgHeight - 25,
            anchorX: 0.5,
            anchorY: 0.5
        });
        items.push(closeItem);

        var toStarSystem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("button-short-default.png"),
            cc.spriteFrameCache.getSpriteFrame("button-short-press.png"),
            function () {
                mainLayer.showStarSystemDetail(this.model.starSystem);
            }, this);
        toStarSystem.attr({
            x: colonyDetailBgWidth/2,
            y: 30,
            anchorX: 0.5,
            anchorY: 0.5
        });
        items.push(toStarSystem);
        var toStarSystemLabel = new cc.LabelTTF("查看星球", null, 20 );
        toStarSystemLabel.attr({
            color: colors.tech_detail_research,
            x: 59,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });
        toStarSystem.addChild(toStarSystemLabel);

        var menu = new cc.Menu(items);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);

        this.render();
        this.model.on("evaluate",this.render,this);
    },
    render:function(){
        this.disasterLabel.setVisible(this.model.get("disasterCountDown")>0);
        this.disasterLabel.setString("文明衰退中,还有"+this.model.get("disasterCountDown")*100+"年。");
        this.populationLabel.setString(texts.population+bigNumberToHumanReadable_zh_cn(this.model.get("population")));
        this.maxPopulationLabel.setString(texts.max_population+bigNumberToHumanReadable_zh_cn(this.model.get("maxPopulation")));

        this.populationGrowLabel.setString(texts.populationGrow+Math.round(this.model.get("populationGrowRate")*100)+"% "+texts.per100Year);
        this.launchRateLabel.setString(texts.launch_rate+Math.round(this.model.get("launchRate")*100)+"% "+texts.per100Year);
        this.scienceRateLabel.setString(texts.science_grow+Math.round(this.model.get("scienceGenerate")*100)/100+"点 "+texts.per100Year);
    }
})