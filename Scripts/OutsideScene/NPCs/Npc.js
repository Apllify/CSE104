class Npc{

    drawLayer = null;
    playerReference = null;

    name = "";
    spritePath = "";

    fontStyle = undefined;

    constructor(drawLayer, playerReference, name, spritePath, fontStyle ){
        this.drawLayer = drawLayer;
        this.playerReference=  playerReference;

        this.name = name;
        this.spritePath = spritePath;

        this.fontStyle = fontStyle;
    }

    
}