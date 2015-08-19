var buildRichText = function( options ) {
    options = options || {};
    var richText = options.richText || new ccui.RichText();
    richText.ignoreContentAdaptWithSize(false);
    richText.width = options.width || 200;
    richText.height = options.height || 30;
    var str = options.str || options.text || "";
    var fontSize = options.fontSize || 16;
    var fontColor = options.fontColor || cc.color.WHITE;
    var fontFamily = options.fontFamily || "Arial";
    var opacity = options.opacity || 255;
    var segments = str.split(/[{|}]/);
    var tag = 1;
    _.each( segments, function(segment){
        var frame = null;
        if ( segment.substr(0,1) === "[" && segment.substr( segment.length - 1, 1) === "]" ) {
            var iconName = segment.substr(1, segment.length -2);
            frame = cc.spriteFrameCache.getSpriteFrame(iconName+".png");
        }
        if ( frame ) {
            var reimg = new ccui.RichElementImage(tag, cc.color.WHITE, 255, frame );
            richText.pushBackElement(reimg);
        } else {
            var re = new ccui.RichElementText(tag, new cc.FontDefinition({
                fillStyle: fontColor,
                fontName: fontFamily,
                fontSize: fontSize,
                fontWeight: "normal",
                fontStyle: "normal"
            }), opacity, segment);
            richText.pushBackElement(re);
        }
        tag++;
    });
    return richText;
}