"use strict";

class Monologue{

    timeElapsed = 0;

    textContent = [""];
    speakerName = "";
    currentLineIndex = 0;

    destroyed = false;


    isVerticalOffset = 1; // whether the text box is at top or bottom of screen
    drawLayer = null;
    textStyle = undefined;
    speakerNameTextStyle = undefined;

    backgroundBox = null;
    topBorder = null;
    leftBorder = null;
    bottomBorder = null;
    rightBorder =null;

    nameTagBox = null;
    nameTagText = null;

    cursor = null;
    textDisplay = null;

    constructor(drawLayer, textContent, textStyle, speakerName = "", isVerticalOffset = 1){

        this.drawLayer = drawLayer;
        this.textContent = textContent; // a list of all the text lines

        this.textStyle = textStyle;
        //create a copy of the dictionary so we can change just the color
        this.speakerNameTextStyle = {...this.textStyle};
        this.speakerNameTextStyle.fill = 0x000000;
        this.speakerNameTextStyle.stroke = 0x00000;


        this.speakerName = speakerName;
        this.isVerticalOffset = isVerticalOffset;

        //create the text box and its border
        this.backgroundBox = new Rectangle(0, this.isVerticalOffset * 500, 800, 100).getGraphics(0x000000);
        this.drawLayer.addChild(this.backgroundBox);

        this.topBorder = new Rectangle(0, this.isVerticalOffset * 500, 800, 10).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.topBorder);

        this.leftBorder = new Rectangle(0, this.isVerticalOffset * 500, 10, 100).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.leftBorder);

        this.bottomBorder = new Rectangle(0, this.isVerticalOffset * 500+ 90, 800, 10).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.bottomBorder);

        this.rightBorder = new Rectangle(790, this.isVerticalOffset * 500, 10, 100).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.rightBorder);



        //create and add the main text content
        this.textDisplay = new TextDisplay(this.drawLayer, this.textContent[this.currentLineIndex], 
            {x:50, y:this.isVerticalOffset * 500 + 20}, this.textStyle);


        //create the name tag box and the name tag text
        if (this.isVerticalOffset === 1){
            this.nameTagBox = new Rectangle(600, 450, 200, 50).getGraphics(0xFFFFFF);
            this.drawLayer.addChild(this.nameTagBox);

            this.nameTagText = new TextDisplay(this.drawLayer, this.speakerName, {x:600, y:450}, this.speakerNameTextStyle);
            this.nameTagText.centerHorizontallyAt(700);
            this.nameTagText.centerVerticallyAt(475);

        }
        else if (this.isVerticalOffset === 0){
            this.nameTagBox = new Rectangle(600, 100, 200, 50).getGraphics(0xFFFFFF);
            this.drawLayer.addChild(this.nameTagBox);

            this.nameTagText = new TextDisplay(this.drawLayer, this.speakerName, {x:600, y:100}, this.speakerNameTextStyle);
            this.nameTagText.centerHorizontallyAt(700);
            this.nameTagText.centerVerticallyAt(125);
        }
        //new TextDisplay(this.drawLayer, this.speakerName, {})

        //create a small flashing cursor
        this.cursor = new Rectangle(760, this.isVerticalOffset * 500 + 40, 20, 20).getGraphics(0xFFFFFF);
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

        //update the alpha of the cursor using a cosine function
        this.cursor.alpha = Math.abs(Math.cos(2 * this.timeElapsed));


    }

    updateTextLine(){
        this.textDisplay.setText(this.textContent[this.currentLineIndex]);
    }

    isDone(){
        return this.destroyed;
    }

    destroy(){
        //remove the main components of the text box
        this.textDisplay.destroy();
        this.backgroundBox.destroy();
        this.cursor.destroy();

        //remove the borders of the text box
        this.topBorder.destroy();
        this.leftBorder.destroy();
        this.rightBorder.destroy();
        this.bottomBorder.destroy();

        //destroy the speaker name tag
        this.nameTagBox.destroy();
        this.nameTagText.destroy();

        this.destroyed = true;
    }


}