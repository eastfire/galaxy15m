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

        gameModel.set("colonizeRate", Math.floor(colonized/all*100) );
        var year = Math.round(options.model.get("year")-START_YEAR);
        if ( year > MAX_YEAR ) year = MAX_YEAR;
        var str = options.model.get("playerName")+"在"+year+
            "年时间里\n占领了银河系"+( colonized >= all ? "所有" : (gameModel.get("colonizeRate")+"%") )+"的星系";
        label = new cc.LabelTTF(str, null, 25);
        label.attr({
            color: colors.gameover,
            x: cc.winSize.width/2,
            y: cc.winSize.height-190,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(label);

        if ( options.model.get("year") < 100000 ) {
            var bonus = Math.round( 100000 - options.model.get("year") )*100;
            label = new cc.LabelTTF("时间奖励："+bonus, null, 25);
            label.attr({
                color: colors.gameover,
                x: cc.winSize.width / 2,
                y: cc.winSize.height - 245,
                anchorX: 0.5,
                anchorY: 0.5
            });
            this.addChild(label);
            options.model.set("score", options.model.get("score") + bonus);
        }

        str = "你的得分:"+Math.floor(options.model.get("score"));
        label = new cc.LabelTTF(str, null, 25 );
        label.attr({
            color: colors.gameover,
            x: cc.winSize.width/2,
            y: cc.winSize.height-300,
            anchorX: 0.5,
            anchorY: 0.5
        })
        this.addChild(label);

        var continueItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("button-short-default.png"),
            cc.spriteFrameCache.getSpriteFrame("button-short-press.png"),
            function () {
                this.getParent().addChild(new ScoreBoardLayer());
                this.removeFromParent(true);
            }, this );

        continueItem.attr({
            x: cc.winSize.width / 2.0,
            y: 50,
            anchorX: 0.5,
            anchorY: 0.5
        });
        var continueText = new cc.LabelTTF(texts.continue, "宋体", dimens.game_over_continue);
        continueText.attr({
            color: cc.color.WHITE,
            x: continueItem.width/2,
            y: continueItem.height/2
        });
        continueItem.addChild( continueText );
        var continueMenu = new cc.Menu(continueItem);
        continueMenu.x = 0;
        continueMenu.y = 0;
        this.addChild(continueMenu, 20);
    }
});

var FIREBASE_URL = "https://galaxy15m.firebaseio.com"
var TOP_SCORE_COUNT = 25

var ScoreBoardLayer = cc.LayerColor.extend({
    ctor:function (options) {
        this._super(cc.color.WHITE);

        this.scoreQuery = new Firebase(FIREBASE_URL+"/score").endAt().limit(TOP_SCORE_COUNT);
        this.scoreRef = this.scoreQuery.ref();
        var self = this;
        this.score = null;
        this.__initList2();

        if ( gameModel ) {
            var year = Math.round(gameModel.get("year")-START_YEAR);
            if ( year > MAX_YEAR ) year = MAX_YEAR;
            var score = {
                name : gameModel.get("playerName"),
                ".priority": Math.floor(gameModel.get("score")),
                rate: gameModel.get("colonizeRate"),
                population: Math.floor(gameModel.get("totalPopulation")),
                time: year,
                score : Math.floor(gameModel.get("score")),
                timestamp: Firebase.ServerValue.TIMESTAMP,
                r: Math.random()
            }
            this.score = score;
            this.scoreRef.push(score, function(){
                cc.log("score upload complete");
                self.__fetchScore.call(self);
            })
        } else {
            this.__fetchScore.call(self);
        }

        var scoreBoardTitle = new cc.LabelTTF("排行榜", "宋体", dimens.score_board_title_font_size);
        scoreBoardTitle.attr({
            color: cc.color.BLACK,
            x: cc.winSize.width/2,
            y: cc.winSize.height - 25
        })
        this.addChild(scoreBoardTitle);

        this.loading = new cc.LabelTTF("加载中……", "宋体", dimens.loading_font_size);
        this.loading.attr({
            color: cc.color.BLACK,
            x: cc.winSize.width/2,
            y: cc.winSize.height/2
        })
        this.addChild(this.loading);

        var continueItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("button-long-default.png"),
            cc.spriteFrameCache.getSpriteFrame("button-long-press.png"),
            function () {
                cc.log("restart")
                window.gameModel = null;
                window.shipNameGenerated = undefined;
                window.colonyNameGenerated = undefined;
                window.starNameGenerated = undefined;
                cc.director.runScene(window.mainGame = new MainGameScene());
            }, this );
        continueItem.attr({
            x: cc.winSize.width / 2,
            y: 25,
            anchorX: 0.5,
            anchorY: 0.5
        });
        var continueText = new cc.LabelTTF(texts.restart, "宋体", dimens.game_over_continue);
        continueText.attr({
            color: cc.color.WHITE,
            x: continueItem.width/2,
            y: continueItem.height/2
        });
        continueItem.addChild( continueText );
        var continueMenu = new cc.Menu(continueItem);
        continueMenu.x = 0;
        continueMenu.y = 0;
        this.addChild(continueMenu, 20);
    },

    __fetchScore:function(){
        var self = this;
        this.scoreQuery.once("value",function(snapshot){
            self.scores = snapshot.val();
            var filteredScore = [];
            _.each(self.scores,function(score){
                if ( score.name ) {
                    filteredScore.unshift(score);
                }
            });
            self.scores = filteredScore;
            self.loading.removeFromParent(true);

            self.__renderList2.call(self);
        })
    },

    __initList2:function(){
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        var innerWidth = dimens.score_board_width;
        var innerHeight = dimens.score_board_height;
        listView.setContentSize(cc.size(innerWidth, innerHeight));
        listView.attr({
            x: (cc.winSize.width-innerWidth)/2,
            y: (cc.winSize.height-innerHeight)/2
        })
        this.addChild(listView,2);

        // create model
        var default_label = new ccui.Text("","Arial", dimens.score_line_font_size);
        default_label.setName("ScoreLabel");
        default_label.setTouchEnabled(false);

        var default_item = new ccui.Layout();
        default_item.setTouchEnabled(false);
        default_item.setContentSize(default_label.getContentSize());
        default_item.width = listView.width;
        default_label.x = default_item.width / 2;
        default_label.y = default_item.height / 2;
        default_item.addChild(default_label);
        default_item.attr({
            height: dimens.score_line_height
        })
        // set model
        listView.setItemModel(default_item);
        this.listView = listView;
    },
    __initList: function(){
        var size = cc.winSize

//        var coverBackground =new cc.LayerColor(cc.color(0,0,0,255))
//        //center
//        coverBackground.attr({
//            x: 0,
//            y: 0,
//            width: cc.winSize.width,
//            height: cc.winSize.height,
//            anchorX : 0.5,
//            anchorY : 0.5
//        });
//        this.addChild(coverBackground, -1);

        // Create the scrollview
        this.scrollView = new ccui.ScrollView();
        this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.setTouchEnabled(true);
        this.scrollView.setContentSize(cc.size(dimens.score_board_width,dimens.score_board_height));
        this.scrollView.x = 0;
        this.scrollView.y = 60;
        this.addChild(this.scrollView,2)

    },

    __renderList2:function(){
        var listView = this.listView;
        var count = this.scores.length;
        _.each(this.scores,function(score) {
            listView.pushBackDefaultItem();
        },this);

        // set item data
        var foundMyself = false;
        var i = 0;
        _.each(this.scores,function(score){
            var color;
            if (score.r == this.score.r) {
                foundMyself = true
            }
            var item = listView.getItem(i);
            var label = item.getChildByName("ScoreLabel");
            this.generateOneScoreLabel(score, label);

            i++;
        },this);
        if ( !foundMyself ) {
            listView.pushBackDefaultItem();
            listView.pushBackDefaultItem();

            var item = listView.getItem(i);
            var label = item.getChildByName("ScoreLabel");
            label.setTextColor(cc.color.BLACK);
            label.setString("……");
            i++;

            var item = listView.getItem(i);
            var label = item.getChildByName("ScoreLabel");
            this.generateOneScoreLabel(this.score, label);
        }
    },
    generateOneScoreLabel:function(score, label){
        var color;
        if (score.r == this.score.r) {
            color = cc.color(255, 0, 0, 255);
        } else
            color = cc.color.BLACK;

        var str = score.name;
        for ( var j = dbcsByteLength(str); j < 16; j++ ){
            str += " ";
        }
        str += score.rate+"%";
        for ( var j = dbcsByteLength(str); j < 22; j++ ){
            str += " ";
        }

        var scoreStr = score.score + "分";
        for ( var j = dbcsByteLength(str); j < 20; j++ ){
            scoreStr = " "+scoreStr;
        }
        str += scoreStr + "   ";

        str += moment(score.timestamp).locale("zh-cn").fromNow();

        label.setTextColor(color);
        label.setString(str);
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