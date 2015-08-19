/**
 * Created by 赢潮 on 2015/8/3.
 */
var TECH_TYPE_PHYSICAL = 0;
var TECH_TYPE_BIOLOGICAL = 1;
var TECH_TYPE_PSYCHOLOGY = 2;
var TECH_TYPE_MECHANICAL = 3;

var TechModel = Backbone.Model.extend({
    defaults:function(){
        return {
            name: "",
            displayName: "",
            tier: 0,
            cost: 3,
            leftMatch : 0,
            rightMatch: 0,
            types: [0] //0: tech, 1: dna， 2：mind
        }
    },
    getCost:function(level, position){
        if ( level <= 0 ) {
            return this.get("cost")
        } else {
            var lowerLevel = gameModel._tech[level-1];
            var match = 0;
            var leftMatch = 0, rightMatch = 0;
            _.each(this.get("types"),function(type){
                var leftTech = lowerLevel[position];
                var rightTech = lowerLevel[position+1];
                if ( _.contains(leftTech.get("types"), type) ) {
                    match++;
                    leftMatch++;
                }
                if ( _.contains(rightTech.get("types"), type) ) {
                    match++;
                    rightMatch++;
                }
            },this);
            this.set("leftMatch",leftMatch);
            this.set("rightMatch",rightMatch);
            var discountPerMatch = gameModel.get("discountPerMatch");
            return Math.round(this.get("cost")*(1-match*discountPerMatch));
        }
    },
    getDescription:function(){
    },
    onGain:function(){
    }
});

var AntiGravity = TechModel.extend({
    defaults:function(){
        return {
            displayName : "反重力",
            name: "anti-gravity",
            tier: 1,
            cost: 15,
            types: [TECH_TYPE_PHYSICAL],
            flavor: "反重力的应用使得直接将一个城市打包送上太空成为可能"
        }
    },
    getDescription:function(){
        return "飞船的载人数增加90万人(当前"+gameModel.get("shipCapacity")+"万人)";
    },
    onGain:function(){
        gameModel.set("shipCapacity",gameModel.get("shipCapacity")+90);
    }
});

var AntiMatter = TechModel.extend({
    defaults:function(){
        return {
            displayName : "反物质引擎",
            name: "anti-matter",
            tier: 2,
            cost: 80,
            types: [TECH_TYPE_PHYSICAL],
            flavor: null
        }
    },
    getDescription:function(){
        return "飞船的最大速度达到0.1倍光速(当前"+gameModel.get("shipSpeed")+"倍光速)";
    },
    onGain:function(){
        if ( gameModel.get("shipSpeed") < 0.1 ) {
            gameModel.set("shipSpeed", 0.1);
        }
    }
});

var Bionics = TechModel.extend({
    effect: 4,
    defaults:function(){
        return {
            displayName : "生化义体",
            name: "bionics",
            tier: 0,
            cost: 5,
            types: [TECH_TYPE_MECHANICAL, TECH_TYPE_BIOLOGICAL],
            flavor: "可以替换的义肢和器官使人们在灾难中的存活率更高"
        }
    },
    getDescription:function(){
        return "殖民地在灾难时的人口增长率加"+this.effect+"倍";
    },
    onGain:function(){
        gameModel.registerEffectingTech("disasterPopulationGrowRate", this, function(rate){
            return rate*(1+this.effect);
        });
    }
});

var CloneHuman = TechModel.extend({
    effect: 1,
    negativeEffect: 0.1,
    defaults:function(){
        return {
            displayName : "克隆人",
            name: "clone-human",
            tier: 1,
            cost: 20,
            types: [TECH_TYPE_BIOLOGICAL],
            flavor: null
        }
    },
    getDescription:function(){
        return "殖民地人口增长率加"+(Math.round(this.effect*100))+"%，人性-"+Math.round(this.negativeEffect*100)+"%";
    },
    onGain:function(){
        gameModel.registerEffectingTech("populationGrowRate", this, function(rate){
            return rate+this.effect;
        });
        gameModel.set("humanity",gameModel.get("humanity") - this.negativeEffect);
    }
});

var CureCancer = TechModel.extend({
    effect: 1,
    defaults:function(){
        return {
            displayName : "治愈癌症",
            name: "cure-cancer",
            tier: 2,
            cost: 40,
            types: [TECH_TYPE_BIOLOGICAL],
            flavor: null
        }
    },
    getDescription:function(){
        return "殖民地人口增长率加"+(Math.round(this.effect*100))+"%";
    },
    onGain:function(){
        gameModel.registerEffectingTech("populationGrowRate", this, function(rate){
            return rate+this.effect;
        });
    }
});

var CureOld = TechModel.extend({
    effect: 1,
    negativeEffect: 0.1,
    defaults:function(){
        return {
            displayName : "消除衰老",
            name: "cure-old",
            tier: 2,
            cost: 80,
            types: [TECH_TYPE_BIOLOGICAL],
            flavor: "没有人会因为衰老而死亡了,然而不会死亡的人类还算是人类吗?"
        }
    },
    getDescription:function(){
        return "殖民地人口增长率加"+(Math.round(this.effect*100))+"%，人性-"+Math.round(this.negativeEffect*100)+"%";
    },
    onGain:function(){
        gameModel.registerEffectingTech("populationGrowRate", this, function(rate){
            return rate+this.effect;
        });
        gameModel.set("humanity",gameModel.get("humanity") - this.negativeEffect);
    }
});

var DysonSphere = TechModel.extend({
    effect: 10,
    defaults:function(){
        return {
            displayName : "戴森球",
            name: "dyson-sphere",
            tier: 4,
            cost: 1500,
            types: [TECH_TYPE_PHYSICAL, TECH_TYPE_MECHANICAL],
            flavor: "围绕恒星建造的戴森球直接吸取恒星的能源（注：为了平衡性，本科技的效果已大幅削弱）"
        }
    },
    getDescription:function(){
        return "殖民地人口上限增加为"+this.effect+"倍";
    },
    onGain:function(){
        gameModel.registerEffectingTech("maxPopulation", this, function(maxPopulation){
            return maxPopulation*this.effect;
        });
    }
});

var Exoskeleton = TechModel.extend({
    effect: 0.2,
    defaults:function(){
        return {
            displayName : "外骨骼",
            name: "exoskeleton",
            tier: 0,
            cost: 5,
            types: [TECH_TYPE_MECHANICAL],
            flavor: null
        }
    },
    getDescription:function(){
        return "增加"+Math.round(this.effect*100)+"%殖民船发射概率";
    },
    onGain:function(){
        gameModel.registerEffectingTech("launchRate", this, function(production){
            return production+this.effect;
        });
    }
});

var FusionDrive = TechModel.extend({
    defaults:function(){
        return {
            displayName : "聚变引擎",
            name: "fusion-drive",
            tier: 1,
            cost: 20,
            types: [TECH_TYPE_PHYSICAL, TECH_TYPE_MECHANICAL],
            flavor: "可控核聚变改变了以往裂变驱动往飞船后扔核弹的简陋模式"
        }
    },
    getDescription:function(){
        return "飞船的最大速度达到0.01倍光速(当前"+gameModel.get("shipSpeed")+"倍光速)";
    },
    onGain:function(){
        if ( gameModel.get("shipSpeed") < 0.01 ) {
            gameModel.set("shipSpeed", 0.01);
        }
    }
});

var MeaningOfLife = TechModel.extend({
    effect: 42000000,
    defaults:function(){
        return {
            displayName : "生命的意义",
            name: "meaning-of-life",
            tier: 4,
            cost: 1200,
            types: [TECH_TYPE_PSYCHOLOGY],
            flavor: "42"
        }
    },
    getDescription:function(){
        return "加"+this.effect+"分";
    },
    onGain:function(){
        gameModel.set("score", gameModel.get("score")+this.effect);
    }
});

var MemoryStorage = TechModel.extend({
    effect: 0.5,
    defaults:function(){
        return {
            displayName : "记忆存储",
            name: "memory-storage",
            tier: 0,
            cost: 3,
            types: [TECH_TYPE_PSYCHOLOGY, TECH_TYPE_BIOLOGICAL],
            flavor: "记忆可以存储在有机质容器中。恢复记忆时需要吃一些类似面包的东西。"
        }
    },
    getDescription:function(){
        return "减少灾难影响时间"+Math.round(this.effect*100)+"%";
    },
    onGain:function(){
        gameModel.registerEffectingTech("disasterLength", this, function(length){
            return length*(1-this.effect);
        });
    }
});

var Psychohistory = TechModel.extend({
    defaults:function(){
        return {
            displayName : "心理史学",
            name: "psychohistory",
            tier: 1,
            cost: 25,
            types: [TECH_TYPE_PSYCHOLOGY],
            flavor: "伟大的谢顿教授通过心理史学预知了文明灾难的发生。他建立了基地和第二基地，使人类世界能更快地度过文明的黑暗时期，重返辉煌。"
        }
    },
    getDescription:function(){
        return "点击受灾难的殖民地时所恢复文明的进程加倍";
    }
});

var QuantumCommunication = TechModel.extend({
    defaults:function(){
        return {
            displayName : "安赛波",
            name: "quantum-communication",
            tier: 0,
            cost: 0,
            types: [TECH_TYPE_PHYSICAL],
            flavor: "安赛波是一种超越光速的量子通信技术．它是银河时代科技的基石。另一个重要的作用是使飞船上的人能在漫漫路途中玩网游以消磨时间。"
        }
    },
    getDescription:function(){
        return "使所有的殖民地和飞船共通信息与科技"
    }
});

//常温超导

var SpiritOfAdventure = TechModel.extend({
    effect: 0.2,
    defaults:function(){
        return {
            displayName : "探险精神",
            name: "spirit-of-adventure",
            tier: 1,
            cost: 15,
            types: [TECH_TYPE_PSYCHOLOGY],
            flavor: ""
        }
    },
    getDescription:function(){
        return "增加"+Math.round(this.effect*100)+"%殖民船发射概率";
    },
    onGain:function(){
        gameModel.registerEffectingTech("launchRate", this, function(rate){
            return rate+this.effect;
        });
    }
});

var SpiritOfScience = TechModel.extend({
    defaults:function(){
        return {
            displayName : "科研精神",
            name: "spirit-of-science",
            tier: 0,
            cost: 6,
            types: [TECH_TYPE_PSYCHOLOGY],
            flavor: ""
        }
    },
    getDescription:function(){
        return "越早点击冒出的科技图标，越有可能多得1倍甚至更多的科技点";
    },
    onGain:function(){
    }
});

var SpaceElevator = TechModel.extend({
    effect:9,
    defaults:function(){
        return {
            displayName : "太空电梯",
            name: "space-elevator",
            tier: 0,
            cost: 3,
            types: [TECH_TYPE_MECHANICAL],
            flavor: "太空电梯减少了往返地面与太空的成本，这使得在同步卫星轨道上建造大型太空船成为可能。同时也引发了大众化太空旅游的兴起。"
        }
    },
    getDescription:function(){
        return "飞船的载人数增加"+this.effect+"万人(当前"+gameModel.get("shipCapacity")+"万人)";
    },
    onGain:function(){
        gameModel.set("shipCapacity",gameModel.get("shipCapacity")+this.effect);
    }
});

var VirtualReality = TechModel.extend({
    negativeEffect: 0.1,
    effect: 0.9,
    defaults:function(){
        return {
            displayName : "全感官虚拟现实",
            name: "virtual-reality",
            tier: 0,
            cost: 5,
            types: [TECH_TYPE_MECHANICAL, TECH_TYPE_PSYCHOLOGY],
            flavor: "代号Matrix的全感官虚拟现实工具最初只是用于提供商业化的游戏体验，但后来被发现可以用于释放人的贪婪欲望，战争狂都在虚拟世界中得到了满足。副作用是，人的进取心也消失了。"
        }
    },
    getDescription:function(){
        return "降低战争爆发概率"+Math.round(this.effect*100)+"%，飞船发射率-"+Math.round(this.negativeEffect*100)+"%";
    },
    onGain:function(){
        gameModel.registerEffectingTech("warRate", this, function(rate){
            return rate*(1-this.effect);
        });
        gameModel.registerEffectingTech("launchRate", this, function(rate){
            return rate-this.negativeEffect;
        });
    }
});

var WarpEngine = TechModel.extend({
    defaults:function(){
        return {
            displayName : "曲率引擎",
            name: "warp-engine",
            tier: 3,
            cost: 320,
            types: [TECH_TYPE_PHYSICAL],
            flavor: "科学家们做了世世代代的梦终于实现了。"
        }
    },
    getDescription:function(){
        return "飞船的最大速度达到1倍光速(当前"+gameModel.get("shipSpeed")+"倍光速)";
    },
    onGain:function(){
        if ( gameModel.get("shipSpeed") < 1 ) {
            gameModel.set("shipSpeed", 1);
        }
    }
});


var CLASS_MAP = {
    "anti-gravity":AntiGravity,
    "anti-matter":AntiMatter,
    "bionic": Bionics,
    "clone-human":CloneHuman,
    "cure-cancer":CureCancer,
    "cure-old":CureOld,
    "dyson-sphere":DysonSphere,
    exoskeleton: Exoskeleton,
    "fusion-drive":FusionDrive,
    "meaning-of-life":MeaningOfLife,
    "memory-storage":MemoryStorage,
    psychohistory: Psychohistory,
    "quantum-communication":QuantumCommunication,
    "space-elevator":SpaceElevator,
    "spirit-of-adventure":SpiritOfAdventure,
    "spirit-of-science":SpiritOfScience,
    "virtual-reality": VirtualReality,
    "warp-engine":WarpEngine
};