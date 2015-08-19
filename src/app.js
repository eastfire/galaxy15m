var UI_Z_INDEX = 101;
var MAX_SCIENCE_ICON = 3;

var UILayer = cc.Layer.extend({
    ctor:function (options) {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.model = options.model;

        this.initView();
        this.render();

        this.model.on("change:year",this.renderTime,this);
        this.model.on("render:population",this.renderPopulation,this);
        this.model.on("render:humanity",this.renderHumanity,this);
        this.model.on("render:score",this.renderScore,this);
        this.model.on("render:science",this.renderScience,this);
        this.model.on("gameover",this.onGameOver,this);

        return true;
    },
    initView:function(){
        var topBarY = cc.winSize.height-15;
        var topBar = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("top-bar.png"));
        topBar.attr({
            x: cc.winSize.width/2,
            y: topBarY,
            scaleX: 400,
            scaleY: 1
        });
        this.addChild(topBar,UI_Z_INDEX);

        var zoomInItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("zoom-in-default.png"),
            cc.spriteFrameCache.getSpriteFrame("zoom-in-press.png"),
            function () {
                mainLayer.zoomIn(0.2);
            }, this);
        zoomInItem.attr({
            x: cc.winSize.width - 75,
            y: 25,
            anchorX: 0.5,
            anchorY: 0.5
        });
        var zoomOutItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("zoom-out-default.png"),
            cc.spriteFrameCache.getSpriteFrame("zoom-out-press.png"),
            function () {
                mainLayer.zoomOut(0.2);
            }, this);
        zoomOutItem.attr({
            x: cc.winSize.width - 25,
            y: 25,
            anchorX: 0.5,
            anchorY: 0.5
        });
        var scienceItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("icon-science.png"),
            cc.spriteFrameCache.getSpriteFrame("icon-science-press.png"),
            function () {
                if ( mainLayer._status === LOOP_PAUSE ) return;
                cc.director.pushScene(new TechScene({model:this.model}));
            }, this);
        scienceItem.attr({
            x: 25,
            y: 25,
            anchorX: 0.5,
            anchorY: 0.5
        });
        var menu = new cc.Menu([zoomInItem, zoomOutItem, scienceItem]);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, UI_Z_INDEX);

        this.scienceLabel = new ccui.Text("123", "Arial", dimens.top_bar_label );
        this.scienceLabel.enableOutline(cc.color.WHITE, 3);
        this.scienceLabel.setTextColor(colors.science_value);
        this.scienceLabel.attr({
            x: 50,
            y: 20,
            anchorX: 0,
            anchorY: 0.5
        })
        scienceItem.addChild(this.scienceLabel,UI_Z_INDEX+1);

        var timeIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icon-time.png"));
        timeIcon.attr({
            x: 20,
            y: topBarY,
            scaleX: 0.6,
            scaleY: 0.6
        });
        this.addChild(timeIcon,UI_Z_INDEX+1);
        this.timeLabel = new cc.LabelTTF("", null, dimens.top_bar_label);
        this.timeLabel.attr({
            color: colors.top_bar_label,
            x: 40,
            y: topBarY-5,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(this.timeLabel,UI_Z_INDEX+1);

        var populationIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icon-population.png"));
        populationIcon.attr({
            x: 250,
            y: topBarY,
            scaleX: 0.6,
            scaleY: 0.6
        });
        this.addChild(populationIcon,UI_Z_INDEX+1);
        this.populationLabel = new cc.LabelTTF("", null, dimens.top_bar_label);
        this.populationLabel.attr({
            color: colors.top_bar_label,
            x: 270,
            y: topBarY-5,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(this.populationLabel,UI_Z_INDEX+1);

        var humanityIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icon-humanity.png"));
        humanityIcon.attr({
            x: 510,
            y: topBarY,
            scaleX: 0.6,
            scaleY: 0.6
        });
        this.addChild(humanityIcon,UI_Z_INDEX+1);
        this.humanityLabel = new cc.LabelTTF("", null, dimens.top_bar_label);
        this.humanityLabel.attr({
            color: colors.top_bar_label,
            x: 530,
            y: topBarY-5,
            anchorX: 0,
            anchorY: 0.5
        })
        this.addChild(this.humanityLabel,UI_Z_INDEX+1);

        var scoreIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icon-score.png"));
        scoreIcon.attr({
            x: 610,
            y: topBarY,
            scaleX: 0.6,
            scaleY: 0.6
        });
        this.addChild(scoreIcon,UI_Z_INDEX+1);
        this.scoreLabel = new cc.LabelTTF("", null, dimens.top_bar_label);
        this.scoreLabel.attr({
            color: colors.top_bar_label,
            x: 630,
            y: topBarY-5,
            anchorX: 0,
            anchorY: 0.5
        });
        this.addChild(this.scoreLabel,UI_Z_INDEX+1);

        this.logBg = new cc.Scale9Sprite(cc.spriteFrameCache.getSpriteFrame("button-bg-default.png"));
        this.logBg.attr({
            x: cc.winSize.width/2,
            y: 32,
            anchorY: 1,
            width: 540,
            height: 450
        });
        this.addChild(this.logBg,UI_Z_INDEX);
    },
    renderScore:function(){
        this.scoreLabel.setString(Math.floor(this.model.get("score")));
    },
    renderTime:function(){
        this.timeLabel.setString(Math.floor(this.model.get("year"))+".G.A");
    },
    renderPopulation:function(){
        this.populationLabel.setString(bigNumberToHumanReadable_zh_cn(this.model.get("totalPopulation"))+"人");
    },
    renderHumanity:function(){
        this.humanityLabel.setString(Math.round(100*this.model.get("humanity"))+"%");
    },
    renderScience:function(){
        this.scienceLabel.setString(Math.floor(this.model.get("science")));
    },
    render:function(){
        this.renderScore();
        this.renderTime();
        this.renderPopulation();
        this.renderHumanity();
        this.renderScience();
    },
    onGameOver:function(){
        this.stopAllActions();
        cc.director.runScene( new GameOverScene({model:this.model}) );
    },
    showLog:function(text){
        if ( this.logLabel != null ) {
            this.logLabel.removeFromParent(true);
        }
        this.logLabel = new cc.LabelTTF(text, null, dimens.log_label_text_size);
        this.logLabel.attr({
            color: colors.log_label,
            x: this.logBg.width/2,
            y: this.logBg.height-20,
            anchorX: 0.5,
            anchorY: 0.5,
            textAlign:cc.TEXT_ALIGNMENT_CENTER,
            width: this.logBg.width,
            height: this.logBg.height
        });
        this.logBg.addChild(this.logLabel);
    }
});

var MIN_SCALE = 0.125;
var MAX_SCALE = 2;

var LOOP_PAUSE = 0;
var LOOP_START = 1;
var COLONY_ICON_TAG = 1;

var MainGameLayer = cc.Layer.extend({
    ctor:function (options) {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.model = options.model;
        this.uiLayer = options.uiLayer;
        this._status = LOOP_START;

        this._scienceIconNumber = 0;
        this.__icon_position = [];

        this.current_slot = 0;
        this._initListener();

        this._zooming = false;

        this.focusToGalaxyPosition(0, 0, 0);
        this._renderGalaxy();
        this._initGalaxyEvent();
        this.yearPerSlot = 100/TIME_SLICE_COUNT;

        this.showDialog("公元2112年6月15日10点10分10秒\n阿西莫夫号殖民船从太阳系启航前往α半人马座\n人类进入了银河纪元\n"+MAX_YEAR+"年时间里人类能将足迹踏遍银河吗？\n让我们拭目以待！", function(){
            this.focusToGalaxyPosition(this.model.startingStarSystem.get("x"), this.model.startingStarSystem.get("y"), times.zoom);
            this.model.startingStarSystem.colony._launch();
            this.loop();
        },this);

        return true;
    },
    focusToGalaxyPosition:function(x,y, time){
        this.scaleRate = 1;
        this.panX = cc.winSize.width/2 - x * this.scaleRate;
        this.panY = cc.winSize.height/2 - y * this.scaleRate;
        this.panAndScale(time)
    },
    _initListener:function(){
        var self = this;
        this.starClickListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                //Check the click area
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    target.opacity = 180;
                    return true;
                }
                return false;
            },
            //Trigger when moving touch
            onTouchMoved: function (touch, event) {
                //move galaxy
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                self.x += delta.x;
                self.y += delta.y;
                self.panX = self.x / self.scaleRate;
                self.panY = self.y / self.scaleRate;
            },
            //Process the touch end event
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                target.setOpacity(255);

                var name = target.getName();
                //find starSystemModel by cid
                var starSystemModel = self._starSystemModelByCid[name];

            }
        });

        this.colonyClickListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                //Check the click area
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    target.opacity = 180;
                    return true;
                }
                return false;
            },
            //Trigger when moving touch
            onTouchMoved: function (touch, event) {
                //move galaxy
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                self.x += delta.x;
                self.y += delta.y;
                self.panX = self.x / self.scaleRate;
                self.panY = self.y / self.scaleRate;
            },
            //Process the touch end event
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                target.setOpacity(255);

                var name = target.getName();
                //find colony by cid
                var colonyModel = self._colonyModelByCid[name];
                colonyModel.shortenDisaster();
                if ( gameModel.hasTech("psychohistory") ) colonyModel.shortenDisaster();
            }
        });

        this.scienceIconClickListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                //Check the click area
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    target.opacity = 180;
                    return true;
                }
                return false;
            },
            //Trigger when moving touch
            onTouchMoved: function (touch, event) {
                //move galaxy
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                self.x += delta.x;
                self.y += delta.y;
                self.panX = self.x / self.scaleRate;
                self.panY = self.y / self.scaleRate;
            },
            //Process the touch end event
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();

                for ( var i = 0 ; i < self.__icon_position.length; i++ ){
                    var position = self.__icon_position[i];
                    if ( position.x == target.x && position.y == target.y ) {
                        self.__icon_position.splice(i,1);
                        break;
                    }
                }

                var increaseScience = 1;
                if ( self.model.hasTech("spirit-of-science") ) {
                    var timeDiff = ( new Date().getTime() - target._create_time ) / 1000;
                    if ( timeDiff < 0.3 ) {
                        increaseScience = 4;
                    } else if ( timeDiff < 0.6 ) {
                        increaseScience = 3;
                    } else if ( timeDiff < 1.2 ) {
                        increaseScience = 2;
                    }
                }
                if ( self._scienceIconNumber > 0 )
                    self._scienceIconNumber--;
                target.runAction(new cc.sequence(cc.spawn(new cc.moveTo(times.get_science,25,25), new cc.rotateBy(times.get_science, 360)),
                    new cc.callFunc(function(){
                        self.model.getScience(increaseScience);
                        target.removeFromParent(true);
                    },self)));
            }
        });
    },
    _renderGalaxy:function(){
        this._starSystemModelByCid = {};
        this._colonyModelByCid = {};
        _.each(this.model._stars,function(starSystemModel){
            var starSystemSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(starSystemModel.get("type")+".png"));
            starSystemSprite.attr({
                x: starSystemModel.get("x"),
                y: starSystemModel.get("y")
            })
            this.addChild(starSystemSprite,1);
            starSystemSprite.setName(starSystemModel.cid);
            this._starSystemModelByCid[starSystemModel.cid] = starSystemModel;

            if ( starSystemModel.isColonized() ) {
                this.onStarSystemColonized(starSystemModel);
            }

            cc.eventManager.addListener(this.starClickListener.clone(), starSystemSprite);
            starSystemModel.on("colonized", this.onStarSystemColonized,this);
        },this);
        this.panAndScale();
    },
    _initGalaxyEvent:function(){
        var self = this;
        cc.eventManager.addListener(this.galaxyUIListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {

                return true;
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;
                self.panX = target.x / self.scaleRate;
                self.panY = target.y / self.scaleRate;
            },
            onTouchEnded: function (touch, event) {

            }
        }), this);

        this.model.on("launch",this.onLaunchShip,this);
        this.model.on("disaster",this.onDisaster,this);
    },
    onStarSystemColonized:function(starSystemModel) {
        var starSystemSprite = this.getChildByName(starSystemModel.cid);
        var colonizedIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icon-colonized.png"));
        colonizedIcon.attr({
            x: starSystemSprite.width / 2,
            y: starSystemSprite.height / 2,
            scaleX: 0.4,
            scaleY: 0.4
        });
        colonizedIcon.setTag(COLONY_ICON_TAG);
        colonizedIcon.setName(starSystemModel.colony.cid);
        starSystemSprite.addChild(colonizedIcon, 0);
        this.registerColonyEvent(starSystemModel.colony);
        cc.eventManager.addListener(this.colonyClickListener.clone(), colonizedIcon);
        starSystemModel.colony.on("showScienceIcon", this.showScienceIcon,this);

    },
    registerColonyEvent:function(colony){
        this._colonyModelByCid[colony.cid] = colony;
        colony.on("change:currentDisasterType", function(model){
            var starSystemSprite = this.getChildByName(model.starSystem.cid);
            var colonizedIcon = starSystemSprite.getChildByTag(COLONY_ICON_TAG);
            var type = model.get("currentDisasterType");
            if ( type ) {
                colonizedIcon.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("icon-disaster-"+type+".png"));
            } else {
                colonizedIcon.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("icon-colonized.png"));
            }
        },this);
    },
    onLaunchShip:function(shipModel){
        var from = shipModel.from;
        var to = shipModel.to;
        var distance = shipModel.distance / UP_SCALE_RATE;
        var angle = Math.atan2( to.get("x") - from.get("x"), to.get("y") - from.get("y")) * 360 / ( Math.PI*2 );

        var shipSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("ship.png"));
        shipSprite.attr({
            rotation: angle,
            x: from.get("x"),
            y: from.get("y"),
            scaleX: 0.25,
            scaleY: 0.25
        });
        this.addChild(shipSprite,5);
        var time = distance / shipModel.get("speed");
        this.uiLayer.showLog(shipModel.get("name")+"从 "+from.get("name")+" 启航前往 "+to.get("name")+"，预计耗时" +Math.round(time)+"年");
        time = time/100;
        shipSprite.runAction(new cc.sequence(new cc.moveTo(time, to.get("x"), to.get("y")), new cc.callFunc(function(){
            var result = shipModel.evaluateColonize();
            if ( result ) {
                this.uiLayer.showLog(shipModel.get("name") + "在 " + to.get("name") + " 建立了殖民地 " + to.colony.get("name"));
            } else {
                this.uiLayer.showLog(shipModel.get("name") + "到达 " + to.get("name")+" 与 "+to.colony.get("name")+" 的殖民者汇合");
            }
            gameModel.removeShip(shipModel);
            shipSprite.removeFromParent(true);
        },this)));
    },
    onDisaster:function(disaster){
        var effectLast = "";
        if ( disaster.effectLength ) {
            effectLast = "，文明倒退了" + Math.round(disaster.effectLength*100) + "年";
        }
        this.uiLayer.showLog(disaster.colony.get("name")+texts.colonyDisaster[disaster.type]+"，"+bigNumberToHumanReadable_zh_cn(disaster.populationLose)+"人丧生"+effectLast);
    },
    _renderColonies:function(){

    },
    hasSamePositionIcon:function(position){
        var index = 0;
        var threshold = 15;
        for ( var i = 0 ; i < this.__icon_position.length ; i++ ) {
            var p = this.__icon_position[i];
            if ( Math.abs( p.x - position.x ) < threshold && Math.abs( p.y - position.y ) < threshold ) {
                return true;
            }
        }
        this.__icon_position.push(position);
    },
    showScienceIcon:function(colonyModel){
        if ( this._scienceIconNumber >= MAX_SCIENCE_ICON ) {
            this.model.getScience(1);
            return;
        }
        //find colony sprite
        var starSystemSprite = this.getChildByName(colonyModel.starSystem.cid);
        var position = starSystemSprite.convertToWorldSpace();
        var left = 50, right = cc.winSize.width-50, bottom = 80, top = cc.winSize.height - 80;
        if ( position.x > left && position.x < right && position.y > bottom && position.y < top ) {
            if ( this.hasSamePositionIcon(position) ) {
                this.model.getScience(1);
                return;
            }
            var scienceIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icon-science.png"))
            scienceIcon.attr({
                x: position.x,
                y: position.y,
                scaleX : 0.1,
                scaleY : 0.1
            });
            this._scienceIconNumber++;
            scienceIcon.runAction(new cc.scaleTo(0.25,1,1));
            scienceIcon._create_time = new Date().getTime();
            this.uiLayer.addChild(scienceIcon,10);
            cc.eventManager.addListener(this.scienceIconClickListener.clone(), scienceIcon);
        } else {
            this.model.getScience(1);
            return;
        }
    },
    showDialog:function(text, callback, context){
        this._status = LOOP_PAUSE;
        var targets = this.actionManager.pauseAllRunningActions();
        var self = this;
        var dialogBg = new cc.Scale9Sprite(cc.spriteFrameCache.getSpriteFrame("button-bg-default.png"));
        dialogBg.x = cc.winSize.width/2;
        dialogBg.y = cc.winSize.height/2;
        dialogBg.width = 480;
        dialogBg.height = 360;

        this.uiLayer.addChild(dialogBg,100);

        var label = new cc.LabelTTF(text, null, dimens.top_bar_label);
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

        var closeItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("close-default.png"),
            cc.spriteFrameCache.getSpriteFrame("close-press.png"),
            function () {
                dialogBg.removeFromParent(true);
                self.actionManager.resumeTargets(targets);
                self._status = LOOP_START;
                if (callback) callback.call(context);
            }, this);
        closeItem.attr({
            x: dialogBg.width - 25,
            y: dialogBg.height - 25,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu([closeItem]);
        menu.x = 0;
        menu.y = 0;
        dialogBg.addChild(menu);
    },

    panAndScale:function(time){
        time = time || 0;
        var s = cc.scaleTo(time, this.scaleRate,this.scaleRate);
        var p = cc.moveTo(time, this.panX*this.scaleRate,this.panY*this.scaleRate);
        this.runAction(new cc.sequence(cc.spawn(s, p), new cc.callFunc(function(){
            this._zooming = false;
        },this)));
    },
    loop:function(){
        this.runAction(cc.sequence(cc.delayTime(TIME_SLOT_LENGTH), cc.callFunc(function(){
            if (this._status) {
                this.model.set("year", this.model.get("year") + this.yearPerSlot);
                this.model.trigger("render:population");
                this.model.trigger("render:humanity");
                this.model.trigger("render:score");
                this.model.trigger("render:science");

                var slot = this.current_slot;
                this.model.evaluateColonies(slot);
                this.model.evaluateShips(slot);
                this.current_slot++;
                if (this.current_slot >= TIME_SLICE_COUNT) this.current_slot = 0;

                if (this.model.get("year") >= this.model.get("maxYear")) {
                    this.model.trigger("gameover");
                    return;
                }
            }
            this.loop();
        },this)));
    },
    zoomIn:function(amount){
        if ( this._status === LOOP_PAUSE ) return;
        if ( this._zooming ) return;
        this._zooming = true;
        if ( this.scaleRate * 2 <= MAX_SCALE ) {
            this.scaleRate *=2;
        } else this.scaleRate = MAX_SCALE;
        this.panAndScale(times.zoom);
    },
    zoomOut:function(amount){
        if ( this._status === LOOP_PAUSE ) return;
        if ( this._zooming ) return;
        this._zooming = true;
        if ( this.scaleRate / 2 >= MIN_SCALE ) {
            this.scaleRate /= 2;
        } else this.scaleRate = MIN_SCALE;
        this.panAndScale(times.zoom);
    }
});

var MainGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        if ( window.gameModel )
            return;
        window.gameModel = new GameModel();
        gameModel.initAll();
        var uiLayer = new UILayer({model: gameModel})
        window.mainLayer = new MainGameLayer({uiLayer:uiLayer, model: gameModel});
        this.addChild(mainLayer);
        this.addChild(uiLayer);
    }
});

