var LogLayer = cc.Layer.extend({
    ctor:function (options) {
        this._super();

        this.model = options.model;
        this.scrollToBottom = options.scrollToBottom;

        this.__initList();

        this.__initBackground();

        this.__renderList();

        var closeItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("back-default.png"),
            cc.spriteFrameCache.getSpriteFrame("back-press.png"),
            function () {
                cc.director.popScene();
            }, this);
        closeItem.attr({
            x: 19,
            y: cc.winSize.height - 19,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu([closeItem]);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);
    },
    __initBackground:function(){
        var background = new cc.Scale9Sprite(cc.spriteFrameCache.getSpriteFrame("button-bg-default.png"));
        background.x = cc.winSize.width/2;
        background.y = cc.winSize.height/2;
        background.width = cc.winSize.width -12;
        background.height = cc.winSize.height -12;
        this.addChild(background);
    },
    __initList:function(){
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        var innerWidth = dimens.log_board_width;
        var innerHeight = dimens.log_board_height;
        listView.setContentSize(cc.size(innerWidth, innerHeight));
        listView.attr({
            x: (cc.winSize.width-innerWidth)/2+10,
            y: (cc.winSize.height-innerHeight)/2
        })
        this.addChild(listView,2);

        // create model
        var default_label = new ccui.Text("","Arial", dimens.log_line_font_size);
        default_label.setName("LogLabel");
        default_label.setTouchEnabled(false);

        var default_item = new ccui.Layout();
        default_item.setTouchEnabled(false);
        default_item.setContentSize(default_label.getContentSize());
        default_item.width = listView.width;
        default_label.x = default_item.width / 2;
        default_label.y = default_item.height / 2;
        default_item.addChild(default_label);
        default_item.attr({
            height: dimens.log_line_height
        })
        // set model
        listView.setItemModel(default_item);
        this.listView = listView;
    },
    __renderList:function(){
        var listView = this.listView;
        _.each(this.model.getLogs(),function(log) {
            listView.pushBackDefaultItem();
        },this);

        // set item data
        var i = 0;
        _.each(this.model.getLogs(),function(log){
            var item = listView.getItem(i);
            var label = item.getChildByName("LogLabel");
            label.setTextColor(colors.log_label);
            label.setString(log);
            i++;
        },this);

        if ( this.scrollToBottom ) {
            listView.runAction(new cc.sequence(new cc.DelayTime(0.3), new cc.CallFunc(function () {
                listView.scrollToBottom(0.3, true)
            }, this)));
        }
    }
});

var LogScene = cc.Scene.extend({
    ctor:function(options){
        this._super();
        this.options = options || {};
    },
    onEnter:function () {
        this._super();
        var layer = new LogLayer(this.options);
        this.addChild(layer);
    }
});