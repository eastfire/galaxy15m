/**
 * Created by 赢潮 on 2015/8/3.
 */
var TECH_TYPE_PHYSICAL = 0;
var TECH_TYPE_BIOLOGICAL = 1;
var TECH_TYPE_PSYCHOLOGY = 2;
var TECH_TYPE_MECHANICAL = 3;
var TECH_TYPE_ELECTRONIC = 4;

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
            return this.get("cost");
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
            var cost = Math.round(this.get("cost")*(1-match*discountPerMatch));
            this._lastCacluatedCost = cost;
            return cost;
        }
    },
    getLastCalculatedCost:function(){
        return this._lastCacluatedCost || this.get("cost");
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
            cost: 50,
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
    effect: 0.1,
    defaults:function(){
        return {
            displayName : "反物质引擎",
            name: "anti-matter",
            tier: 2,
            cost: 300,
            types: [TECH_TYPE_PHYSICAL],
            flavor: null
        }
    },
    getDescription:function(){
        return "飞船的最大速度达到"+this.effect+"倍光速(当前"+gameModel.get("shipSpeed")+"倍光速)";
    },
    onGain:function(){
        if ( gameModel.get("shipSpeed") < this.effect ) {
            gameModel.set("shipSpeed", this.effect);
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
            cost: 8,
            types: [TECH_TYPE_MECHANICAL, TECH_TYPE_BIOLOGICAL, TECH_TYPE_ELECTRONIC],
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
            cost: 40,
            types: [TECH_TYPE_BIOLOGICAL],
            flavor: "与其说是技术的突破，不如说是伦理的突破"
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
            tier: 1,
            cost: 60,
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
            cost: 300,
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

var CyberBrain = TechModel.extend({
    effect: 10,
    negativeEffect: 0.1,
    defaults:function(){
        return {
            displayName : "电子脑",
            name: "cyber-brain",
            tier: 2,
            cost: 50,
            types: [TECH_TYPE_ELECTRONIC, TECH_TYPE_BIOLOGICAL],
            flavor: ""
        }
    },
    getDescription:function(){
        return "创造力加"+Math.round(this.effect)+"，人性-"+Math.round(this.negativeEffect*100)+"%";
    },
    onGain:function(){
        gameModel.registerEffectingTech("creative", this, function(creative){
            return creative+this.effect;
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
            cost: 7200,
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
    effect: 10,
    defaults:function(){
        return {
            displayName : "外骨骼",
            name: "exoskeleton",
            tier: 0,
            cost: 10,
            types: [TECH_TYPE_MECHANICAL],
            flavor: null
        }
    },
    getDescription:function(){
        return "生产力增加"+Math.round(this.effect);
    },
    onGain:function(){
        gameModel.registerEffectingTech("production", this, function(production){
            return production+this.effect;
        });
    }
});

var FusionDrive = TechModel.extend({
    effect : 0.01,
    defaults:function(){
        return {
            displayName : "聚变引擎",
            name: "fusion-drive",
            tier: 1,
            cost: 50,
            types: [TECH_TYPE_PHYSICAL, TECH_TYPE_MECHANICAL],
            flavor: "可控核聚变改变了以往裂变驱动往飞船后扔核弹的简陋模式"
        }
    },
    getDescription:function(){
        return "飞船的最大速度达到"+this.effect+"倍光速(当前"+gameModel.get("shipSpeed")+"倍光速)";
    },
    onGain:function(){
        if ( gameModel.get("shipSpeed") < this.effect ) {
            gameModel.set("shipSpeed", this.effect);
        }
    }
});

var Gill = TechModel.extend({
    negativeEffect: 0.1,
    effect: 100000,
    defaults:function(){
        return {
            displayName : "鳃裂",
            name: "gill",
            tier: 1,
            cost: 80,
            types: [TECH_TYPE_BIOLOGICAL],
            flavor: "如果身处一片汪洋大海中，进化出鳃来似乎是顺理成章的"
        }
    },
    getDescription:function(){
        return "海洋多承载"+bigNumberToHumanReadable_zh_cn(this.effect)+"人每亿km²，人性-"+Math.round(this.negativeEffect*100)+"%";
    },
    onGain:function(){
        _.each(gameModel._stars,function(starSystemModel){
            var planet = starSystemModel._bestPlanet;
            if ( planet.get("seaCoverage") ) {
                planet.set("seaUsage", planet.get("seaUsage") + this.effect);
                planet.calSupportPopulation();
            }
        },this);
        gameModel.set("humanity",gameModel.get("humanity") - this.negativeEffect);
    }
});

var GreatFirewall = TechModel.extend({
    effect: 1,
    negativeEffect: 10,
    defaults:function(){
        return {
            displayName : "宇宙防火墙",
            name: "great-firewall",
            tier: 0,
            cost: 1,
            types: [TECH_TYPE_ELECTRONIC],
            flavor: "根据相关法律，本词条的内容已被屏蔽。"
        }
    },
    getDescription:function(){
        return "人工智能起义的发生概率减少"+Math.round(this.effect*100)+"%，创造力减少"+Math.round(this.negativeEffect);
    },
    onGain:function(){
        gameModel.registerEffectingTech("creative", this, function(creative){
            return creative-this.negativeEffect;
        });
        gameModel.registerEffectingTech("aiRate", this, function(rate){
            return rate*(1-this.effect);
        });
    }
});

var GroupMind = TechModel.extend({
    effect: 2,
    defaults:function(){
        return {
            displayName : "集体心智",
            name: "group-mind",
            tier: 4,
            cost: 6000,
            types: [TECH_TYPE_PHYSICAL, TECH_TYPE_PSYCHOLOGY],
            flavor: "一次意外的物理实现，打通了人类大脑之间的量子通道。从此以后，个人在保留自己的意识的同时，也能体会到其他所有人的喜怒哀乐和生老病死。个体不会逝去,而是留存在整体的回忆中。"
        }
    },
    getDescription:function(){
        return "加"+Math.round(this.effect*100)+"%人性";
    },
    onGain:function(){
        gameModel.set("humanity", gameModel.get("humanity")+this.effect);
    }
});

var IntelligentDolphin = TechModel.extend({
    effect: 100000,
    defaults:function(){
        return {
            displayName : "智能海豚",
            name: "intelligent-dolphin",
            tier: 2,
            cost: 250,
            types: [TECH_TYPE_ELECTRONIC, TECH_TYPE_BIOLOGICAL],
            flavor: ""
        }
    },
    getDescription:function(){
        return "海洋多承载"+bigNumberToHumanReadable_zh_cn(this.effect)+"人每亿km²";
    },
    onGain:function(){
        _.each(gameModel._stars,function(starSystemModel){
            var planet = starSystemModel._bestPlanet;
            if ( planet.get("seaCoverage") ) {
                planet.set("seaUsage", planet.get("seaUsage") + this.effect);
                planet.calSupportPopulation();
            }
        },this);
    }
});

var IntelligentApe = TechModel.extend({
    effect: 30,
    defaults:function(){
        return {
            displayName : "智能猩猩",
            name: "intelligent-ape",
            tier: 3,
            cost: 1200,
            types: [TECH_TYPE_ELECTRONIC, TECH_TYPE_BIOLOGICAL],
            flavor: "人类提升了自己的表兄弟……这样做真的好吗？"
        }
    },
    getDescription:function(){
        return "创造力加"+Math.round(this.effect);
    },
    onGain:function(){
        gameModel.registerEffectingTech("creative", this, function(creative){
            return creative+this.effect;
        });
    }
});

var MeaningOfLife = TechModel.extend({
    effect: 42000,
    defaults:function(){
        return {
            displayName : "生命的意义",
            name: "meaning-of-life",
            tier: 4,
            cost: 4200,
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

var MultiverseCommunication = TechModel.extend({
    defaults:function(){
        return {
            displayName : "平行宇宙通讯",
            name: "multiverse-communication",
            tier: 2,
            cost: 100,
            types: [TECH_TYPE_PHYSICAL],
            flavor: ""
        }
    },
    getDescription:function(){
        return "游戏结束时选择1个已经研发的1级或2级科技作为下次游戏时的初始科技";
    },
    onGain:function(){
    }
});

var MemoryStorage = TechModel.extend({
    effect: 0.5,
    defaults:function(){
        return {
            displayName : "记忆存储",
            name: "memory-storage",
            tier: 0,
            cost: 16,
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

var MindControl = TechModel.extend({
    negativeEffect: 0.4,
    defaults:function(){
        return {
            displayName : "心灵控制",
            name: "mind-control",
            tier: 3,
            cost: 600,
            types: [TECH_TYPE_PSYCHOLOGY, TECH_TYPE_ELECTRONIC],
            flavor: "Big brother is watching you."
        }
    },
    getDescription:function(){
        return "避免所有灾难影响。人性减"+Math.round(this.negativeEffect*100)+"%";
    },
    onGain:function(){
        gameModel.registerEffectingTech("warRate", this, function(rate){
            return 0;
        });
        gameModel.registerEffectingTech("virusRate", this, function(rate){
            return 0;
        });
        gameModel.registerEffectingTech("aiRate", this, function(rate){
            return 0;
        });
        gameModel.set("humanity",gameModel.get("humanity") - this.negativeEffect);
    }
});

var Nanobot = TechModel.extend({
    effect: 50000,
    defaults:function(){
        return {
            displayName : "纳米机器人",
            name: "nanobot",
            tier: 0,
            cost: 20,
            types: [TECH_TYPE_MECHANICAL, TECH_TYPE_ELECTRONIC],
            flavor: ""
        }
    },
    getDescription:function(){
        return "陆地多承载"+bigNumberToHumanReadable_zh_cn(this.effect)+"人每亿km²";
    },
    onGain:function(){
        _.each(gameModel._stars,function(starSystemModel){
            var planet = starSystemModel._bestPlanet;
            if ( planet.get("landCoverage") ) {
                planet.set("landUsage", planet.get("landUsage") + this.effect);
                planet.calSupportPopulation();
            }
        },this);
    }
});

var Psychohistory = TechModel.extend({
    defaults:function(){
        return {
            displayName : "心理史学",
            name: "psychohistory",
            tier: 1,
            cost: 30,
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
            flavor: "安赛波是一种超越光速的量子通信技术。它是银河时代科技的基石。另一个重要的作用是使飞船上的人能在漫漫路途中玩网游以消磨时间。"
        }
    },
    getDescription:function(){
        return "使所有的殖民地和飞船共通信息与科技"
    }
});

var ResistanceCold = TechModel.extend({
    negativeEffect: 0.05,
    effect: 0.5,
    defaults:function(){
        return {
            displayName : "抗寒基因",
            name: "resistance-cold",
            tier: 2,
            cost: 250,
            types: [TECH_TYPE_BIOLOGICAL],
            flavor: ""
        }
    },
    getDescription:function(){
        return "严寒星球的承载人口惩罚减少"+Math.round(this.effect*100)+"%，人性-"+Math.round(this.negativeEffect*100)+"%";
    },
    onGain:function(){
        _.each(gameModel._stars,function(starSystemModel){
            var planet = starSystemModel._bestPlanet;
            if ( planet.get("temperature") == TEMPERATURE_LOW ) {
                planet.set("penalty", Math.max(0,planet.get("penalty") - this.effect));
                planet.calSupportPopulation();
            }
        },this);
        gameModel.set("humanity",gameModel.get("humanity") - this.negativeEffect);
    }
});

var ResistanceHeat = TechModel.extend({
    negativeEffect: 0.05,
    effect: 0.5,
    defaults:function(){
        return {
            displayName : "抗热基因",
            name: "resistance-heat",
            tier: 2,
            cost: 250,
            types: [TECH_TYPE_BIOLOGICAL],
            flavor: ""
        }
    },
    getDescription:function(){
        return "酷热星球的承载人口惩罚减少"+Math.round(this.effect*100)+"%，人性-"+Math.round(this.negativeEffect*100)+"%";
    },
    onGain:function(){
        _.each(gameModel._stars,function(starSystemModel){
            var planet = starSystemModel._bestPlanet;
            if ( planet.get("temperature") == TEMPERATURE_HIGH ) {
                planet.set("penalty", Math.max(0,planet.get("penalty") - this.effect));
                planet.calSupportPopulation();
            }
        },this);
        gameModel.set("humanity",gameModel.get("humanity") - this.negativeEffect);
    }
});

var SpiritOfAdventure = TechModel.extend({
    effect: 20,
    defaults:function(){
        return {
            displayName : "探险精神",
            name: "spirit-of-adventure",
            tier: 1,
            cost: 50,
            types: [TECH_TYPE_PSYCHOLOGY],
            flavor: ""
        }
    },
    getDescription:function(){
        return "生产力增加"+Math.round(this.effect);
    },
    onGain:function(){
        gameModel.registerEffectingTech("production", this, function(rate){
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
            cost: 12,
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
            cost: 5,
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

var Superconductor = TechModel.extend({
    effect: 1,
    defaults: function(){
        return {
            displayName : "常温超导",
            name: "superconductor",
            tier: 0,
            cost: 5,
            types: [TECH_TYPE_PHYSICAL],
            flavor: ""
        }
    },
    getDescription:function(){
        return "每当研发科技时，获得相当于花费"+Math.round(this.effect*100)+"%的分数";
    },
    onGain:function(){
        gameModel.getScore(this.get("cost")*this.effect);
        gameModel.registerEffectingTech("gainTech", this, function(techModel){
            gameModel.getScore(techModel.getLastCalculatedCost()*this.effect);
        });
    }
})

var Telekinesis = TechModel.extend({
    effect:30,
    defaults:function(){
        return {
            displayName : "意念移物",
            name: "telekinesis",
            tier: 3,
            cost: 1000,
            types: [TECH_TYPE_PSYCHOLOGY],
            flavor: "May the force be with you."
        }
    },
    getDescription:function(){
        return "增加生产力"+Math.round(this.effect);
    },
    onGain:function(){
        gameModel.registerEffectingTech("production", this, function(rate){
            return rate+this.effect;
        });
    }
});

var TimeMachine = TechModel.extend({
    effect:20000,
    defaults:function(){
        return {
            displayName : "时间机器",
            name: "time-machine",
            tier: 4,
            cost: 6400,
            types: [TECH_TYPE_MECHANICAL,TECH_TYPE_PHYSICAL],
            flavor: "如果可以重来，你还会升级这个科技吗？"
        }
    },
    getDescription:function(){
        return "将游戏计时回拨"+this.effect+"年";
    },
    onGain:function(){
        var year = gameModel.get("year");
        if ( year > this.effect )
            gameModel.set("year",gameModel.get("year")-this.effect);
        else gameModel.set("year", 0 );
    }
});

var VirtualReality = TechModel.extend({
    negativeEffect: 10,
    effect: 0.9,
    defaults:function(){
        return {
            displayName : "全感官虚拟现实",
            name: "virtual-reality",
            tier: 0,
            cost: 10,
            types: [TECH_TYPE_PSYCHOLOGY, TECH_TYPE_ELECTRONIC],
            flavor: "代号Matrix的全感官虚拟现实工具最初只是用于提供商业化的游戏体验，但后来被发现可以用于释放人的贪婪欲望，战争狂都在虚拟世界中得到了满足。副作用是，人的进取心也消失了。"
        }
    },
    getDescription:function(){
        return "降低战争爆发概率"+Math.round(this.effect*100)+"%，生产力下降"+Math.round(this.negativeEffect);
    },
    onGain:function(){
        gameModel.registerEffectingTech("warRate", this, function(rate){
            return rate*(1-this.effect);
        });
        gameModel.registerEffectingTech("production", this, function(production){
            return production-this.negativeEffect;
        });
    }
});

var WarpEngine = TechModel.extend({
    effect: 1,
    defaults:function(){
        return {
            displayName : "曲率引擎",
            name: "warp-engine",
            tier: 3,
            cost: 1000,
            types: [TECH_TYPE_PHYSICAL],
            flavor: "科学家们做了世世代代的梦终于实现了。虽然引擎的理论功率能使飞船达到几倍甚至几十倍光速，但是为了乘客不会犯晕时症，并不会启用过高的速度"
        }
    },
    getDescription:function(){
        return "飞船的最大速度达到"+this.effect+"倍光速(当前"+gameModel.get("shipSpeed")+"倍光速)";
    },
    onGain:function(){
        if ( gameModel.get("shipSpeed") < this.effect ) {
            gameModel.set("shipSpeed", this.effect);
        }
    }
});

var Wing = TechModel.extend({
    negativeEffect: 0.2,
    effect: 10000,
    defaults:function(){
        return {
            displayName : "翼膜",
            name: "wing",
            tier: 3,
            cost: 800,
            types: [TECH_TYPE_BIOLOGICAL],
            flavor: ""
        }
    },
    getDescription:function(){
        return "气态行星多承载"+bigNumberToHumanReadable_zh_cn(this.effect)+"人每亿km²，人性-"+Math.round(this.negativeEffect*100)+"%";
    },
    onGain:function(){
        _.each(gameModel._stars,function(starSystemModel){
            var planet = starSystemModel._bestPlanet;
            if ( planet.get("airCoverage") ) {
                planet.set("airUsage", planet.get("airUsage") + this.effect);
                planet.calSupportPopulation();
            }
        },this);
        gameModel.set("humanity",gameModel.get("humanity") - this.negativeEffect);
    }
});

var CLASS_MAP = {
    "anti-gravity":AntiGravity,
    "anti-matter":AntiMatter,
    "bionic": Bionics,
    "clone-human":CloneHuman,
    "cure-cancer":CureCancer,
    "cure-old":CureOld,
    "cyber-brain":CyberBrain,
    "dyson-sphere":DysonSphere,
    exoskeleton: Exoskeleton,
    "fusion-drive":FusionDrive,
    gill: Gill,
    "group-mind":GroupMind,
    "great-firewall": GreatFirewall,
    "intelligent-ape":IntelligentApe,
    "intelligent-dolphin":IntelligentDolphin,
    "meaning-of-life":MeaningOfLife,
    "memory-storage":MemoryStorage,
    "mind-control":MindControl,
    "multiverse-communication":MultiverseCommunication,
    nanobot: Nanobot,
    psychohistory: Psychohistory,
    "quantum-communication":QuantumCommunication,
    "resistance-cold":ResistanceCold,
    "resistance-heat":ResistanceHeat,
    "space-elevator":SpaceElevator,
    "spirit-of-adventure":SpiritOfAdventure,
    "spirit-of-science":SpiritOfScience,
    superconductor: Superconductor,
    telekinesis:Telekinesis,
    "time-machine":TimeMachine,
    "virtual-reality": VirtualReality,
    "warp-engine":WarpEngine,
    wing: Wing
};