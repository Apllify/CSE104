"use strict";

class Monologue{

    timeElapsed = 0;

    drawLayer = null;
    textContent = [""];
    textStyle = undefined;

    backgroundBox = null;
    cursor = null;
    textDisplay = null;

    constructor(drawLayer, textContent, textStyle){
        this.drawLayer = drawLayer;
        this.textContent = textContent; // a list of all the text lines

        this.textStyle = textStyle;

        this.backgroundBox = new Rectangle(0, 500, 800, 100).getGraphics(0x000000);
        this.drawLayer.addChild(this.backgroundBox);

        //create and center the text
        this.textDisplay = new TextDisplay(this.drawLayer, this.textContent[0], {x:0, y:500}, this.textStyle);
        this.textDisplay.centerHorizontallyAt(400);

        this.cursor = new Rectangle(760, 540, 20, 20).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.cursor);

    }

    update(delta, inputs){

    }

    destroy(){
        
    }


}