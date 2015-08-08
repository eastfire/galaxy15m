/**
 * Created by 赢潮 on 2015/8/3.
 */
MAX_TECH_LEVEL = 5;

var TechLayer = cc.LayerColor.extend({
    ctor:function(options){
        this._super(cc.color.WHITE);
        this.options = options || {};
        this.model = this.options.model;

        var closeItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("close-default.png"),
            cc.spriteFrameCache.getSpriteFrame("close-press.png"),
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

        this.model.on("render:science",this.renderScience,this);

        this.renderPyramid();
    },
    renderScience:function(){
        this.scienceLabel.setString(this.model.get("science"));
    },
    renderPyramid:function(){
        var starX = 50;
        var currentY = starX;
        var currentX = 50;
        var techWidth = 100;
        var techHeight = 100;
        var level = 0;
        var items = [];
        _.each(this.model._tech,function(tier){
            _.each(tier,function(techModel){
                var name = techModel.get("name");
                var sprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("tech-"+name+".png"));
                sprite.attr({
                    x: currentX,
                    y: currentY
                });
                this.registerOnClickTech(sprite, techModel, level);

                this.addChild(sprite);
                currentX += techWidth;
            },this);

            this.pushAddTechItem(currentX,currentY,level,items);

            level ++;
            currentX = starX + level*(techWidth/2);
            currentY += techHeight;
        },this);
        if ( this.model._tech.length == 0 ) {
            this.pushAddTechItem(currentX,currentY,0,items);
        } else if ( this.model._tech[this.model._tech.length-1].length >= 2 && this.model._tech.length<MAX_TECH_LEVEL ){
            this.pushAddTechItem(currentX,currentY,level,items);
        }

        var menu = new cc.Menu(items);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);
    },
    pushAddTechItem:function(currentX, currentY, level, items) {
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
            anchorY: 0.5
        });
        items.push(addTechItem);
    },
    registerOnClickTech:function(sprite, techModel, level){

    },
    onAddTech:function(level){
        cc.log("show "+level+" techs");
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