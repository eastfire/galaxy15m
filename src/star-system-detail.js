/**
 * Created by 赢潮 on 2015/8/24.
 */
/**
 * Created by 赢潮 on 2015/8/24.
 */
var StarSystemDetailSprite = cc.Scale9Sprite.extend({
    show:function(){
        this.stopAllActions();
        this.runAction(cc.moveTo(times.show_tech_detail, this.x < 0 ?
            this.width/2 : cc.winSize.width-this.width/2, cc.winSize.height/2+10));
    },
    close:function(){
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
        this.starSystemModel = options.starSystemModel;
        this.model = options.model;

        var starSystemDetailBgWidth = 300;
        var starSystemDetailBgHeight = cc.winSize.height - 80;
        this.offset = starSystemDetailBgWidth;

        this.attr({
            width: starSystemDetailBgWidth,
            height: starSystemDetailBgHeight,
            y: cc.winSize.height/2+10
        });

        if ( targetX > cc.winSize.width - starSystemDetailBgWidth - 50 ) {
            this.x = -starSystemDetailBgWidth/2;
        } else {
            this.x = cc.winSize.width+starSystemDetailBgWidth/2;
        }
        blockMyTouchEvent(this);

        var lineHeight = 25;
        var y = starSystemDetailBgHeight-30;
        var nameLabel = new cc.LabelTTF(this.starSystemModel.get("name")+"的最宜居行星", null, dimens.colony_detail_name);
        nameLabel.attr({
            color: colors.colony_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(nameLabel);
        y -= lineHeight;

        var typeLabel = new cc.LabelTTF(texts.planet_types[this.model.get("type")], null, dimens.colony_label);
        typeLabel.attr({
            color: colors.colony_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        });
        this.addChild(typeLabel);
        y -= lineHeight;

        var distanceLabel = new cc.LabelTTF("距离恒星："+Math.round(this.model.get("distanceToSun")*100)/100+"个天文单位", null, dimens.colony_label);
        distanceLabel.attr({
            color: colors.log_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(distanceLabel);
        y -= lineHeight;

        var temperatureLabel = new cc.LabelTTF("表面平均温度："+Math.round(this.model.get("displayTemperature")*100)/100+"℃", null, dimens.colony_label);
        temperatureLabel.attr({
            color: colors.log_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(temperatureLabel);
        y -= lineHeight;

        var gravityLabel = new cc.LabelTTF("表面重力："+Math.round(this.model.get("displayGravity")*100)/100+"G", null, dimens.colony_label);
        gravityLabel.attr({
            color: colors.log_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(gravityLabel);
        y -= lineHeight;

        var superficialAreaLabel = new cc.LabelTTF("表面积："+Math.round(this.model.get("superficialArea")*100)/100+"亿km²", null, dimens.colony_label);
        superficialAreaLabel.attr({
            color: colors.log_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(superficialAreaLabel);
        y -= lineHeight;

        if ( this.model.get("type") === CORE_SOLID ) {
            var penalty = this.model.get("penalty");
            var discount = 1 - Math.min(1, penalty);
            var superficialAreaLabel = new cc.LabelTTF("陆地"+Math.round(this.model.get("landCoverage")*100)+"% 可承载"+
                bigNumberToHumanReadable_zh_cn(this.model.get("landSuperficialArea")*this.model.get("landUsage")*discount)+"人", null, dimens.colony_label);
            superficialAreaLabel.attr({
                color: colors.log_label,
                x: 30,
                y: y,
                anchorX: 0,
                anchorY: 0.5
            })
            this.addChild(superficialAreaLabel);
            y -= lineHeight;

            var seaStr;
            if ( !this.model.get("seaCoverage") ) {
                seaStr = "没有海洋";
            } else {
                seaStr = "海洋"+Math.round(this.model.get("seaCoverage")*100)+"% 可承载"+
                    bigNumberToHumanReadable_zh_cn(this.model.get("seaSuperficialArea")*this.model.get("seaUsage")*discount)+"人";
            }
            var seaSuperficialAreaLabel = new cc.LabelTTF(seaStr, null, dimens.colony_label);
            seaSuperficialAreaLabel.attr({
                color: colors.log_label,
                x: 30,
                y: y,
                anchorX: 0,
                anchorY: 0.5
            })
            this.addChild(seaSuperficialAreaLabel);
            y -= lineHeight;
        }

        var str = "大气层："+texts.atmosphere[this.model.get("atmosphere")];
        if ( this.model.get("atmosphere") != ATMOSPHERE_NONE ) str += " "+texts.atmosphere_quality[this.model.get("atmosphericQuality")];
        var atmosphereLabel = new cc.LabelTTF( str, null, dimens.colony_label);
        atmosphereLabel.attr({
            color: colors.log_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(atmosphereLabel);
        y -= lineHeight;

        var maxPopulationLabel = new cc.LabelTTF("预计可承载人数："+ bigNumberToHumanReadable_zh_cn(this.model.get("maxPopulation")), null, dimens.colony_label);
        maxPopulationLabel.attr({
            color: colors.log_label,
            x: 30,
            y: y,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(maxPopulationLabel);
        y -= lineHeight;

        var items = [];
        var closeItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("close-default.png"),
            cc.spriteFrameCache.getSpriteFrame("close-press.png"),
            this.close, this);
        closeItem.attr({
            x: starSystemDetailBgWidth - 25,
            y: starSystemDetailBgHeight - 25,
            anchorX: 0.5,
            anchorY: 0.5
        });
        items.push(closeItem);

        var menu = new cc.Menu(items);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);
    }
})