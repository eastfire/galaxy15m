var res = {
    stars_plist : "res/stars.plist",
    stars_png : "res/stars.png",
    ui_plist : "res/ui.plist",
    ui_png : "res/ui.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

var times = {
    zoom: 0.5,
    show_tech_detail: 0.3,

    get_science: 0.25
}

var dimens = {
    top_bar_label: 20,
    log_label_text_size: 14,

    tech_detail_tech_name : 20,
    tech_detail_tech_description: 18,
    tech_detail_tech_flavor: 14,
    tech_detail_research: 16,

    congratulation: 50,
    game_over_continue: 20,
    score_board_title_font_size: 36,
    loading_font_size: 50,

    score_board_width: 750,
    score_board_height: 350,
    score_line_font_size: 20,
    score_line_height: 35
}

var colors = {
    top_bar_label: cc.color.BLACK,
    log_label: cc.color.WHITE,
    dialog_label: cc.color.WHITE,
    gameover: cc.color.WHITE,
    science_value: cc.color.BLUE,
    tech_detail_tech_name: cc.color.WHITE,
    tech_detail_tech_description: cc.color.WHITE,
    tech_detail_tech_flavor: new cc.Color(0xcc,0xcc,0xcc),
    tech_detail_research: cc.color.WHITE
}

var texts = {
    confirm: "确定",
    continue: "继续",
    restart: "再来一次大爆炸",

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
        ai:"AI暴动统治人类",
        asteroid: "遭受小行星撞击",
        economy: "爆发了经济崩溃",
        environment: "爆发了环境危机",
        virus: "致命病毒爆发",
        war: "爆发了核大战"
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