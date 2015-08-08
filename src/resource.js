var res = {
    stars_plist : "res/stars.plist",
    stars_png : "res/stars.png",
    ui_plist : "res/ui.plist",
    ui_png : "res/ui.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

var times = {
    zoom: 0.5
}

var dimens = {
    top_bar_label: 20,
    log_label_text_size: 14,

    congratulation: 50
}

var colors = {
    top_bar_label: cc.color.BLACK,
    gameover: cc.color.WHITE,
    science_value: cc.color.BLUE
}

var texts = {
    engineType:{
        nuclear: "裂变驱动",
        fusion: "聚变驱动",
        em: "电磁驱动",
        warp: "曲率驱动"
    },
    shipType:{
        generation: "世代船",
        hibernation: "冬眠船",
        shuttle:"穿梭船"
    },
    colonyDisaster: {
        ai:"AI暴动",
        asteroid: "小行星撞击",
        economy: "经济崩溃",
        environment: "环境危机",
        virus: "病毒爆发",
        war: "世界大战"
    },
    shipDisaster: {
        ai: "AI叛变",
        lost: "迷失太空",
        riot: "哗变",
        mechanical: "机械故障"
    },

    technology: {
        fusion:"核聚变",
        "heat-resistance-material":"耐超高温材料",
        hibernation:"冬眠仓"
    },
    dna:{
        "cold-resistance":"抵御寒冷",
        "heat-resistance":"抵御酷热"
    },
    spiritual: {
        "world-government":"世界政府",
        "mind-control":"思维控制",
        "group-awareness":"群体意识",
        mindDrive:"思动"
    }
}