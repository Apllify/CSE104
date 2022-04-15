"use strict";
class MenuScene{

    inputPrompts = [];  
    currentInputPrompt = 0;

    backgroundGraphics = null;

    leftCursorGraphics = null;
    rightCursorGraphics = null;

    startFontStyle = null;
    menuFontStyle = null;

    // these variables allow us to make sure that a button press that spans multiple frames isn't
    // considered as several different button presses in the manuScene.

    
    destroying = false;

    constructor(drawLayers, game){
        //create a background graphics
        this.game = game;
        this.backgroundGraphics= new PIXI.Graphics();

        this.backgroundGraphics.beginFill(0x000000);
        this.backgroundGraphics.drawRect(0, 0, 800, 600);

        drawLayers.backgroundLayer.addChild(this.backgroundGraphics);

        //setup the menu font style
        this.startFontStyle = new PIXI.TextStyle({
            fontFamily : "Arial",
            fontSize : 100,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",

        }

        );

        this.menuFontStyle = new PIXI.TextStyle({
            fontFamily : "Arial",
            fontSize : 36,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        this.exitFontStyle = new PIXI.TextStyle({
            fontFamily : "Arial",
            fontSize : 36,
            fontWeight : "bold",
            fill : "#ff0000",
            stroke : "#ff0000",
        });

        

        //instantiate the text boxes
        this.exitJoke = new FadeText(drawLayers.foregroundLayer, "There Is No Escape...", {x:380, y:500}, this.exitFontStyle, 2);
        this.exitJoke.centerHorizontallyAt(400);
        this.exitJoke.centerVerticallyAt(500);

        this.inputPrompts.push(new TextDisplay(drawLayers.foregroundLayer, "PLAY", {x:380, y:300}, this.startFontStyle));
        this.inputPrompts[0].centerHorizontallyAt(400);
        this.inputPrompts[0].centerVerticallyAt(300);


        this.inputPrompts.push(new TextDisplay(drawLayers.foregroundLayer, "EXIT", {x:380, y:400}, this.menuFontStyle));
        this.inputPrompts[1].centerHorizontallyAt(400);
        this.inputPrompts[1].centerVerticallyAt(400);

        //set up the two user cursors
        const startDimensions = this.inputPrompts[this.currentInputPrompt].getDimensions();

        this.leftCursorGraphics = new PIXI.Graphics();
        this.rightCursorGraphics = new PIXI.Graphics();

        //draw and position the left cursor
        this.leftCursorGraphics.beginFill(0xDCC3FF);

        this.leftCursorGraphics.moveTo(15, 0);
        this.leftCursorGraphics.lineTo(-15, -20);
        this.leftCursorGraphics.lineTo(-15, 20);
        this.leftCursorGraphics.closePath();

        this.leftCursorGraphics.endFill();

        this.leftCursorGraphics.x = 400 - startDimensions.width /2 - 40;
        this.leftCursorGraphics.y = 300;


        //draw the right cursor
        this.rightCursorGraphics.beginFill(0xDCC3FF);

        this.rightCursorGraphics.moveTo(-15, 0);
        this.rightCursorGraphics.lineTo(15, -20);
        this.rightCursorGraphics.lineTo(15, 20);
        this.rightCursorGraphics.closePath();

        this.rightCursorGraphics.endFill();

        this.rightCursorGraphics.x = 400 + startDimensions.width / 2 + 40;
        this.rightCursorGraphics.y = 300;



        //add the two cursors to the scene
        drawLayers.foregroundLayer.addChild(this.leftCursorGraphics);
        drawLayers.foregroundLayer.addChild(this.rightCursorGraphics);

        
        

    }

    refreshPromptCrosshair(){
        if (this.destroying){   // don't try to update if destroy is called.
            return 
        }
        const currentPromptPosition = this.inputPrompts[this.currentInputPrompt].getCenterPosition(); 
        const currentPromptDimensions = this.inputPrompts[this.currentInputPrompt].getDimensions();

        this.leftCursorGraphics.x = currentPromptPosition.x - currentPromptDimensions.width / 2 - 40;
        this.leftCursorGraphics.y = currentPromptPosition.y;

        this.rightCursorGraphics.x = currentPromptPosition.x + currentPromptDimensions.width / 2+ 40;
        this.rightCursorGraphics.y = currentPromptPosition.y;


    }

    update(delta, inputs){
        if (this.destroying){   // don't try to update if destroy is called.
            return 
        }
        
        //check for down and up inputs to select prompts and update the alpha value for fading texts.
        this.exitJoke.update(delta, inputs);

        if (inputs.down.isJustDown){
            // make sure that a button press that lasts multiple frames isn't considered as several
            // different button presses.

            this.currentInputPrompt += 1;

            if (this.currentInputPrompt > this.inputPrompts.length-  1){
                this.currentInputPrompt = 0;
            }

        }


        if (inputs.up.isJustDown || inputs.upAlt.isJustDown){
            // make sure that a button press that lasts multiple frames isn't considered as several
            // different button presses.

            this.currentInputPrompt -= 1;

            if (this.currentInputPrompt < 0){
                this.currentInputPrompt = this.inputPrompts.length - 1;
            }

        }



        if (inputs.enter.isJustDown){     // handles input prompt selections. If "PLAY", we create a
            // boss scene; if "EXIT", we close the window.
            if (this.currentInputPrompt === 0){
                mainGame.changeScene(new BossScene(drawLayers, this.game));
            }
            else{
                this.exitJoke.initiate();
            }
            
        }

        

        this.refreshPromptCrosshair();



    }

    

    destroy(){          
        // destroy method for menuScene 
        this.destroying = true;
        drawLayers.backgroundLayer.removeChild(this.backgroundGraphics);
        drawLayers.foregroundLayer.removeChild(this.leftCursorGraphics);
        drawLayers.foregroundLayer.removeChild(this.rightCursorGraphics);
        drawLayers.foregroundLayer.removeChild(this.exitJoke);
        for (let element of this.inputPrompts){
            element.destroy();
        }
        this.exitJoke.destroy();S
        delete this;

    }

}