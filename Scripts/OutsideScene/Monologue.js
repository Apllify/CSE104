"use strict";

class Monologue{

    timeElapsed = 0;

    textContent = [""];
    speakerName = "";
    currentLineIndex = 0;

    textStyleExceptions = { //if you want some specific lines to have a different font

    };
    
    shakingExceptions = [] //the index of the lines where shaking is enabled

    destroyed = false;

    isFirstUpdate = true;


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
            {x:30, y:this.isVerticalOffset * 500 + 20}, this.textStyle);



        //create the name tag box and the name tag text
        if (this.isVerticalOffset === 1){
            this.nameTagText = new TextDisplay(this.drawLayer, this.speakerName, {x:0, y:0}, this.speakerNameTextStyle);

            const nameTagBoxWidth = this.nameTagText.getDimensions().width + 20;
            const nameTagBoxHeight = this.nameTagText.getDimensions().height + 20;

            this.nameTagBox = new Rectangle(800 - nameTagBoxWidth, 500 - nameTagBoxHeight, nameTagBoxWidth, nameTagBoxHeight).getGraphics(0xFFFFFF);
            this.drawLayer.addChild(this.nameTagBox);

            //recreate the name tag text in order to have correct z axis
            this.nameTagText.destroy();
            this.nameTagText = new TextDisplay(this.drawLayer, this.speakerName, {x:0, y:0}, this.speakerNameTextStyle);


            this.nameTagText.centerHorizontallyAt(800 - nameTagBoxWidth /2);
            this.nameTagText.centerVerticallyAt(500 - nameTagBoxHeight / 2);

        }
        else if (this.isVerticalOffset === 0){
            this.nameTagText = new TextDisplay(this.drawLayer, this.speakerName, {x:0, y:0}, this.speakerNameTextStyle);

            const nameTagBoxWidth = this.nameTagText.getDimensions().width + 20;
            const nameTagBoxHeight = this.nameTagText.getDimensions().height + 20;

            this.nameTagBox = new Rectangle(800 - nameTagBoxWidth, 100, nameTagBoxWidth, nameTagBoxHeight).getGraphics(0xFFFFFF);
            this.drawLayer.addChild(this.nameTagBox);

            //recreate the name tag text in order to have correct z axis
            this.nameTagText.destroy();
            this.nameTagText = new TextDisplay(this.drawLayer, this.speakerName, {x:0, y:0}, this.speakerNameTextStyle);


            this.nameTagText.centerHorizontallyAt(800 - nameTagBoxWidth /2);
            this.nameTagText.centerVerticallyAt(100 + nameTagBoxHeight / 2);
        }
        //new TextDisplay(this.drawLayer, this.speakerName, {})


        //create a small flashing cursor
        this.cursor = new Rectangle(760, this.isVerticalOffset * 500 + 40, 20, 20).getGraphics(0xFFFFFF);
        this.drawLayer.addChild(this.cursor);

    }

    setTextStyleException(lineIndex, textStyle){
        this.textStyleExceptions[lineIndex] = textStyle;
    }

    setShakingException(lineIndex){
        this.shakingExceptions.push(lineIndex);
    }

    setTextContent(newTextContent){
        this.textContent = newTextContent;

        // //replace the current text display lolllll
        // this.textDisplay.destroy();
        // this.textDisplay = new TextDisplay(this.drawLayer, this.textContent[this.currentLineIndex], 
        //     {x:30, y:this.isVerticalOffset * 500 + 20}, this.textStyle);
    }

    update(delta, inputs){

        //don't do anything if the entity is already destroyed
        if (this.destroyed){
            return;
        }

        //update the internal timer
        this.timeElapsed += delta;

        //update the first dialogue to use the correct exception rules if necessary
        if (this.isFirstUpdate){
            this.isFirstUpdate = false;
            this.updateTextLine();
        }

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


        //shaking the text if necessary
        let xRandom = 0;
        let yRandom = 0;

        if (this.shakingExceptions.includes(this.currentLineIndex)){
            xRandom = Math.random() * 8 - 4;
            yRandom = Math.random() * 8 - 4;
        }

        if (this.destroyed){
            return;
        }
        this.textDisplay.textEntity.x = 30 + xRandom;
        this.textDisplay.textEntity.y = this.isVerticalOffset * 500 + 20 + yRandom;
    }

    updateTextLine(){
        //check if the current line is an exception
        if (this.textStyleExceptions[this.currentLineIndex] !== undefined){
            this.textDisplay.setTextStyle(this.textStyleExceptions[this.currentLineIndex]);
            this.textDisplay.setText(this.textContent[this.currentLineIndex]);
        }
        else{
            this.textDisplay.setTextStyle(this.textStyle);
            this.textDisplay.setText(this.textContent[this.currentLineIndex]);

        }
    }

    isDone(){
        return this.destroyed;
    }

    destroy(){
        if (!this.destroyed){
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


}