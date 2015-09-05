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
    log_label_text_size: 16,

    tech_detail_tech_name : 22,
    tech_detail_tech_description: 20,
    tech_detail_tech_discount: 18,
    tech_detail_tech_flavor: 18,
    tech_detail_research: 17,

    colony_detail_name: 20,
    colony_label: 18,

    congratulation: 50,
    game_over_continue: 20,
    score_board_title_font_size: 36,
    loading_font_size: 50,

    score_board_width: 750,
    score_board_height: 350,
    score_line_font_size: 20,
    score_line_height: 35,

    log_board_width: 750,
    log_board_height: 420,
    log_line_font_size: 20,
    log_line_height: 35
}

var colors = {
    top_bar_label: cc.color.BLACK,
    log_label: new cc.Color(0x06,0xf4,0xf4),
    dialog_label: cc.color.WHITE,
    gameover: cc.color.WHITE,
    science_value: cc.color.BLUE,
    tech_detail_tech_name: cc.color.WHITE,
    tech_detail_tech_description: cc.color.WHITE,
    tech_detail_tech_flavor: new cc.Color(0xcc,0xcc,0xcc),
    tech_detail_research: cc.color.WHITE,

    colony_label: cc.color.WHITE
}

var texts = {
    confirm: "确定",
    continue: "继续",
    check_score_board: "查看排名",
    check_log: "查看日志",

    restart: "再来一次大爆炸",


    population: "人口: ",
    max_population: "承载上限: ",
    populationGrow: "人口增长: ",
    launch_rate: "殖民船发射率: ",
    success_rate: "殖民船殖民成功率: ",
    science_grow: "科技增加 ",
    per100Year: "每100年",

    colonyDisaster: {
        ai:["AI暴动统治人类", "爆发了AI起义", "被天网统治了"],
        asteroid: "遭受小行星撞击",
        economy: "爆发了经济崩溃",
        environment: "爆发了环境危机",
        virus: ["爆发了脑残病毒", "爆发了僵尸病毒", "爆发了黑死病毒"],
        war: ["爆发了核大战","爆发了世界大战","爆发了水源大战","爆发了香料争夺战"]
    },
    planet_types:["",
    "气态（类木）行星",
    "固态（类地）行星"],

    atmosphere: [
        "",
        "无",
        "稀薄",
        "正常",
        "浓厚",
    ],
    atmosphere_quality: [
        "无毒",
        "微毒",
        "剧毒"
    ],

    "please_choose_tech_for_next_game": "请选择1个科技作为下次游戏的起始科技"
}