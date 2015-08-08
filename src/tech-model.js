/**
 * Created by 赢潮 on 2015/8/3.
 */
var TechModel = Backbone.Model.extend({
    defaults:function(){
        return {
            name: "",
            displayName: "",
            tier: 1,
            cost: 3,
            type: 0 //0: tech, 1: dna， 2：mind
        }
    },
    getCost:function(){

    },
    getDescription:function(){
    }
});

var QuantumCommunication = TechModel.extend({
    defaults:function(){
        return {
            displayName : "量子通讯",
            name: "quantum-communication",
            tier: 1,
            cost: 0,
            type: 0,
            flavor: "量子通信是银河时代科技的基石。谁也不想发条短信要几年以后才有回复，对吧。同时它也使本游戏得以自洽。"
        }
    },
    getDescription:function(){
        return "使所有的殖民地能共通信息与科技"
    }
})

var CLASS_MAP = {
    "quantum-communication":QuantumCommunication
};