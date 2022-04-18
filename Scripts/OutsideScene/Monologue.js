"use strict";

class Monologue{

    timeElapsed = 0;

    textContent = [""];
    currentLineIndex = 0;

    destroyed = false;


    drawLayer = null;
    textStyle = undefined;

    backgroundBox = null;
    topBorder = null;
    leftBorder = null;
    bottomBorder = null;
    rightBorder =null;

    cursor = null;
    textDisplay = null;

    constructor(drawLayer, textContent, textStyle){
        this.drawLayer = drawLayer;
        this.textContent = textContent; // a list of all the text lines

        this.textStyle = textStyle;

        this.backgroundBox = new Rectangle(0, 500, 800, 100).getGraphics(0x000000);
        this.drawLayer.addChild(this.backgroundBox);

        this.topBorder = new Rectangle(0, 500, 800, 10).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.topBorder);

        this.leftBorder = new Rectangle(0, 500, 10, 100).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.leftBorder);

        this.bottomBorder = new Rectangle(0, 590, 800, 10).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.bottomBorder);

        this.rightBorder = new Rectangle(790, 500, 10, 100).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.rightBorder);

        //create and center the text
        this.textDisplay = new TextDisplay(this.drawLayer, this.textContent[this.currentLineIndex], {x:50, y:510}, this.textStyle);
        this.textDisplay.setText(this.textContent[this.currentLineIndex]);

        this.cursor = new Rectangle(760, 540, 20, 20).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.cursor);

    }

    update(delta, inputs){

        //don't do anything if the entity is already destroyed
        if (this.destroyed){
            return;
        }

        //update the internal timer
        this.timeElapsed += delta;

        //check for confirm input to advance monologue
        if (inputs.enter.isJustDown){

            if (this.currentLineIndex < this.textContent.length - 1){
                this.currentLineIndex += 1;
                this.updateTextLine();
            }
            else{
                this.destroy();
            }

        }


    }

    updateTextLine(){
        this.textDisplay.setText(this.textContent[this.currentLineIndex]);
    }

    destroy(){
        this.textDisplay.destroy();
        this.backgroundBox.destroy();
        this.cursor.destroy();
        this.destroyed = true;
    }


}