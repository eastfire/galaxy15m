var LOG_TYPE_LAUNCH = 1;
var LOG_TYPE_COLONIZE = 2;
var LOG_TYPE_COLONY_DISASTER = 3;
var LOG_TYPE_SHIP_DISASTER = 4;

var COLONY_DISASTER_TYPE_AI = 1;
var COLONY_DISASTER_TYPE_ASTEROID = 2;
var COLONY_DISASTER_TYPE_ENVIRONMENT = 3;
var COLONY_DISASTER_TYPE_ECONOMY = 4;
var COLONY_DISASTER_TYPE_VIRUS = 5;
var COLONY_DISASTER_TYPE_WAR = 6;

var LogModel = Backbone.Model.extend({
    defaults:function(){
        return {
            type: LOG_TYPE_LAUNCH,
            year: 0,
            colonyName: "",
            colonyId : 0,
            shipName: "",
            shipId: 0,
            starSystemName: "",
            starSystemId : 0,
            toStarSystemName: "",
            toStarSystemId: 0,
            disasterType: 0
        }
    }
});