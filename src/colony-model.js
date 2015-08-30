var OLD_CITY_NAME_POOL = [ "伦敦","纽约","巴黎","东京","香港","首尔","芝加哥","上海","北京","新加坡","悉尼","迪拜",
    "米兰","悉尼","多伦多","莫斯科","法兰克福","阿姆斯特丹","布鲁塞尔","旧金山","华盛顿","吉隆坡","雅加达","圣保罗",
    "迈阿密","都柏林","墨尔本","苏黎世","新德里","慕尼黑","伊斯坦布尔","波士顿","华沙","达拉斯","维也纳","亚特兰大",
    "巴塞罗那","台北","圣地亚哥","里斯本","约翰内斯堡","广州","杜塞尔多夫","斯德哥尔摩","布拉格","蒙特利尔","罗马",
    "汉堡","马尼拉","休斯敦","柏林","雅典","特拉维夫","班加罗尔","哥本哈根","开罗","波哥大","温哥华","曼谷","开普敦",
    "费城","布达佩斯","布达佩斯","贝鲁特","里约热内卢","卢森堡市","西雅图","澳门","加拉加斯","胡志明市","奥克兰",
    "奥斯陆","基辅","钦奈","布加勒斯特","曼彻斯特","卡拉奇","利马","开普敦","利雅得","蒙得维的亚","明尼阿波利斯",
    "阿布扎比","尼科西亚","伯明翰","布里斯班","日内瓦","加尔各答","底特律","丹佛","蒙特雷","布拉迪斯拉发","路易港",
    "卡萨布兰卡","麦纳麦","斯图加特","索菲亚","科隆","圣路易斯","赫尔辛基","巴拿马城","圣迭戈","拉各斯","珀斯",
    "克里夫兰","圣胡安","卡尔加里","危地马拉城","大阪","深圳","格拉斯哥","内罗毕","布里斯托尔","河内","辛辛那提",
    "夏洛特","安特卫普","多哈","拉合尔","巴尔的摩","吉达","爱丁堡","安曼","海得拉巴","萨格勒布","阿德莱德","科威特城",
    "波特兰","贝尔格莱德","圣约瑟","突尼斯","圣何塞","里加","巴伦西亚","堪萨斯城","菲尼克斯","阿拉木图","瓜达拉哈拉",
    "里昂","基多","圣彼得堡","利兹","圣多明各","圣萨尔瓦多","维尔纽斯","鹿特丹","坦帕","哥伦布","印第安纳波利斯",
    "匹兹堡","埃德蒙顿","塔林","天津","普纳","波尔图","阿雷格里港","奥兰多","歌德堡","马赛","科伦坡","卢布尔雅那",
    "特古西加尔巴","里士满","伊斯兰堡","马斯喀特","德班","奥斯汀","贝尔法斯特","瓜亚基尔","名古屋","都灵","南安普顿",
    "密尔沃基","惠灵顿","库里提巴","阿克拉","乔治城","南安普敦","印第安纳波利斯","阿雷格里港","斯特拉斯堡","哈博罗内",
    "重庆","里士满","匹兹堡","蒂华纳","奥斯汀","拿骚","特古西加尔巴","里尔","库里奇巴","海牙","哈特福德","弗罗茨瓦夫",
    "埃德蒙顿","洛桑","达卡","纽伦堡","卢萨卡","坎帕拉","毕尔巴鄂","杜阿拉","阿比让","盐湖城","波兹南","惠灵顿",
    "渥太华","达喀尔","克雷塔罗","德累斯顿","泰因河畔纽卡斯尔","斯科普里","地拉那","贝洛奥里藏特","南京","青岛",
    "成都","杭州","佛罗伦萨","比勒陀利亚","图卢兹","奥胡斯","圣安东尼奥","不来梅","纳什维尔","博洛尼亚","堪培拉",
    "名古屋","萨克拉门托","普罗维登斯","罗安达","大连","利物浦","杰克逊维尔","普埃布拉","高雄","明斯克","林茨",
    "第比利斯","拉斯维加斯","马普托","哈拉雷","加的夫","厦门","伯明翰","莱昂","西班牙港","槟城","孟菲斯","阿伯丁",
    "阿布贾","汉诺威","泗水","伯尔尼","哈利法克斯","华雷斯城","亚历山大里亚","波尔多","金边","温尼伯","卡利","格林斯伯勒",
    "热那亚","麦德林","圣克鲁斯-德特内里费","蒙彼利埃","科尔多瓦","武汉","格拉茨","耶路撒冷","新奥尔良","罗切斯特","尼斯",
    "釜山","温得和克","达曼","克赖斯特彻奇","累西腓","塔什干","哈密尔顿","雷克雅未克","那不勒斯","塔尔萨","路德维希港",
    "金斯敦","巴西利亚","新山","西安","福冈","谢菲尔德","伊兹密尔","诺丁汉","得梅因","坎皮纳斯","基希讷乌","海法",
    "麦迪逊","埃里温","宿务市","纳闽","萨尔瓦多"];
var NEW_COLONY_NAME_POOL = [ "海伯利安","鲸心","川陀","塔图因"]

var colonyNameGenerated;
var generateColonyName=function() {
    var name;
    if ( colonyNameGenerated === undefined ) {
        colonyNameGenerated = {};
    }
    name = _.sample(OLD_CITY_NAME_POOL);

    if ( colonyNameGenerated[name] ) {
        var count = ++colonyNameGenerated[name];
        name += count+"号"
    } else {
        colonyNameGenerated[name] = 1;
    }
    name = "新·"+name;
    return name;
}

var ColonyModel = Backbone.Model.extend({
    defaults:function(){
        return {
            name: null,
            population: 1, //单位：万人
            populationGrowRate: 0,
            maxPopulation: 10000,


            currentDisaster: null,
            disasterCountDown: 0,

            disasterRate: {
                ai: 0,
                asteroid: 0,
                environment: 0,
                economy: 0,
                virus: 0,
                war: 0
            },
            disasterResistance: {
                ai: 0,
                asteroid: 0,
                environment: 0,
                economy: 0,
                virus: 0,
                war: 0
            },
            disasterEffectYear: {
                ai: 0,
                asteroid: 0,
                environment: 0,
                economy: 0,
                virus: 0,
                war: 0
            },

            launchRate: 0
        }
    },
    initialize:function(){
        this._launchAccumulate = 0;
        this._warAccumulate = 0;
        this._virusAccumulate = 0;
        this._aiAccumulate = 0;
    },
    evaluate:function(){
        this._evaluateMaxPopulation();
        this._evaluatePopulationGrowRate();
        this._generatePopulation();
        this._generateScience();
        this._evaluateLaunchRate();
        if ( this._canLaunch() ) {
            this._launch();
        }
        this._evaluateDisaster();
        this.trigger("evaluate");
    },
    _canLaunch:function(){
        if ( gameModel.hasMaxShip() ) return false;

        this._launchAccumulate += this.get("launchRate");
        if ( this._launchAccumulate >= 1 ) {
            this._launchAccumulate = 0;
            return true;
        } else return false;
    },
    _launch:function(){
        var destStar = null;
        var distance_2;
        var length = this.starSystem._otherStarSystemEntry.length;

        var allFull = true;
        for ( i = 0; i < length; i++ ){
            var entry = this.starSystem._otherStarSystemEntry[i];
            if ( entry.star.isColonized() ) {
                //remove star
                this.starSystem._otherStarSystemEntry.splice(i,1);
                length--;
                i--;
            } else {
                if ( entry.star.isColonizing() ) {
                    allFull = false;
                } else {
                    destStar = entry.star;
                    distance_2 = entry.distance_2;
                    break;
                }
            }
        }

        if ( !destStar ) {
            var length = this.starSystem._otherStarSystemEntry.length;
            for ( i = 0; i < length; i++ ){
                var entry = this.starSystem._otherStarSystemEntry[i];
                if ( entry.star.isColonizing() ) {
                    destStar = entry.star;
                    distance_2 = entry.distance_2;
                    break;
                }
            }
        }

        if ( destStar ) {
            var immigrant = gameModel.get("shipCapacity");
            var ship = new ShipModel({
                population: immigrant
            });
            this.set("population", this.get("population") - immigrant);
            ship.from = this.starSystem;
            ship.to = destStar;
            ship.distance = Math.sqrt(distance_2);
            destStar.setColonizing(ship);
            window.gameModel.addShip(ship);
        } else {
            //all star is full?
        }
    },
    getLaunchRateEffectText:function(){
    },
    getPopulationGrowRateEffectText:function(){
    },
    getCrisisRateEffectText:function(type){
    },
    _evaluateMaxPopulation:function(){
        var maxPopulation = this.planet.get("maxPopulation");
        maxPopulation = gameModel.techEffect("maxPopulation", maxPopulation);
        this.set("maxPopulation",maxPopulation);
    },
    _evaluatePopulationGrowRate:function(){
        var currentPopulation = this.get("population");
        var maxPopulation = this.get("maxPopulation");
        var rate = 0;
        if ( this.get("currentDisasterType") ) {
            rate = 0;
            rate = gameModel.techEffect("disasterPopulationGrowRate", rate);
        } else {
            if (currentPopulation >= maxPopulation) {
                rate = 0;
            } else {
                rate = 1;
                rate = gameModel.techEffect("populationGrowRate", rate);
            }
        }
        this.set("populationGrowRate",rate);
    },
    hasDisaster:function(){

    },
    shortenDisaster:function(){
        if ( this.get("currentDisasterType") ) {
            this.set("disasterCountDown",this.get("disasterCountDown")-1);
            if ( this.get("disasterCountDown") <= 0 ) {
                this.set({
                    currentDisasterType: null
                });
            }
            return true;
        } else {
            return false;
        }
    },
    _evaluateDisaster:function(){
        if ( !this.shortenDisaster() ) {
            this._evaluateWarDisaster();
            this._evaluateVirusDisaster();
            this._evaluateAIDisaster();
        }
    },
    _evaluateWarDisaster:function(){
        var currentPopulation = this.get("population");
        var maxPopulation = this.get("maxPopulation");
        var maxPopulationWarThreshold = gameModel.get("maxPopulationWarThreshold");
        var rate = 0;
        if ( currentPopulation >= maxPopulation && currentPopulation >= maxPopulationWarThreshold ) {
            rate = gameModel.get("maxPopulationIncreaseWarRate");
        }
        rate = gameModel.techEffect("warRate", rate);
        this._warAccumulate += rate;
        if ( this._warAccumulate >= 1 ) {
            this._warAccumulate = 0;
            var value = this.get("population") * ((Math.random()*0.5+0.1));
            this.losePopulation(value);
            var countDown = Math.round(Math.random()*10)+30;
            countDown = adjust = gameModel.techEffect("disasterLength", countDown);
            this.set({
                currentDisasterType: "war",
                disasterCountDown : countDown
                });
            gameModel.trigger("disaster", {
                type: "war",
                colony: this,
                populationLose : value,
                effectLength: countDown
            });
        }
    },
    _evaluateVirusDisaster:function(){
        var rate = 0;
        var count = gameModel.techCountByType(TECH_TYPE_BIOLOGICAL);
        rate = gameModel.techEffect("virusRate", count/100);
        this._virusAccumulate += rate;
        if ( this._virusAccumulate >= 1 ) {
            this._virusAccumulate = 0;
            var value = this.get("population") * ((Math.random()*0.5+0.1));
            this.losePopulation(value);
            var countDown = Math.round(Math.random()*10)+30;
            countDown = adjust = gameModel.techEffect("disasterLength", countDown);
            this.set({
                currentDisasterType: "virus",
                disasterCountDown : countDown
            });

            gameModel.trigger("disaster", {
                type: "virus",
                colony: this,
                populationLose : value,
                effectLength: countDown
            });
        }
    },
    _evaluateAIDisaster:function(){
        var rate = 0;
        var count = gameModel.techCountByType(TECH_TYPE_ELECTRONIC);
        rate = gameModel.techEffect("AIRate", count/100);
        this._aiAccumulate += rate;
        if ( this._aiAccumulate >= 1 ) {
            this._aiAccumulate = 0;
            var value = this.get("population") * ((Math.random()*0.5+0.1));
            this.losePopulation(value);
            var countDown = Math.round(Math.random()*10)+30;
            countDown = adjust = gameModel.techEffect("disasterLength", countDown);
            this.set({
                currentDisasterType: "ai",
                disasterCountDown : countDown
            });

            gameModel.trigger("disaster", {
                type: "ai",
                colony: this,
                populationLose : value,
                effectLength: countDown
            });
        }
    },
    losePopulation:function(value){
        var currentPopulation = this.get("population");
        window.gameModel.getPopulation(-value);
        this.set("population", currentPopulation - value);
    },
    _generatePopulation:function(){
        var currentPopulation = this.get("population");
        var maxPopulation = this.get("maxPopulation");
        var change = currentPopulation*this.get("populationGrowRate");
        if ( change + currentPopulation > maxPopulation ) {
            change = maxPopulation - currentPopulation;
        }
        if ( change > 0 ) {
            window.gameModel.getScore(change/10000);
        }
        if ( change != 0 ) {
            window.gameModel.getPopulation(change);
            this.set("population", currentPopulation + change);
        }
    },
    _evaluateLaunchRate:function(){
        if ( gameModel.get("shipCapacity") > this.get("population") ) {
            this.set("launchRate", 0);
            return;
        }
        var production;
        var population = this.get("population");
        var maxPopulationLaunchThreshold = gameModel.get("maxPopulationLaunchThreshold");
        if ( this.get("currentDisasterType") ) {
            production = 0;
        } else {
            production = this.get("population") / 10000000;

            var rate = 1;
            rate = gameModel.techEffect("launchRate", rate);
            if ( population >= this.get("maxPopulation") && population >= maxPopulationLaunchThreshold )
                rate += gameModel.get("maxPopulationIncreaseLaunchRate");

            production *= rate;

            production = Math.min(production, 0.5);
            //TODO gravity adjust
        }
        this.set("launchRate", production);
    },
    _generateScience:function(){
        var adjust = 1;
        if ( this.get("currentDisasterType") ) {
            adjust = 0;
        } else {
            adjust = gameModel.techEffect("scienceAdjust", adjust);
        }
        if ( adjust != 0 ) {
            var science = this.get("population") / 1000000 ;
            science *= adjust;

            science = Math.min(science, 5);

            this.set("scienceGenerate",science);
            if ( mainLayer._scienceIconNumber < MAX_SCIENCE_ICON && Math.random() < science / 10 ) {
                if ( science > 1 ) science -= 1;
                else science = 0;
                this.trigger("showScienceIcon",this);
            }

            window.gameModel.getScience(science);
        } else {
            this.set("scienceGenerate",0);
        }
    },
    vanished:function(){
    }
});