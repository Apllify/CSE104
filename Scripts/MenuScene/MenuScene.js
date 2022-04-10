class MenuScene{

    inputPrompts = [];  
    currentInputPrompt = 0;

    backgroundGraphics = null;

    leftCursorGraphics = null;
    rightCursorGraphics = null;

    startFontStyle = null;
    menuFontStyle = null;


    wasDownPressedLastFrame = false;
    wasUpPressedLastFrame = false;
    destroying = false;

    constructor(drawLayers){
        //create a background graphics
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


        //instantiate the text boxes
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
        if (this.destroying){
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
        //check for down and up inputs to select prompts
        if (inputs.down.isDown){
            if (!this.wasDownPressedLastFrame){

                this.currentInputPrompt += 1;

                if (this.currentInputPrompt > this.inputPrompts.length-  1){
                    this.currentInputPrompt = 0;
                }
            }

            this.wasDownPressedLastFrame = true;
        }
        else if (inputs.up.isDown || inputs.upAlt.isDown){
            if (!this.wasUpPressedLastFrame){

                this.currentInputPrompt -= 1;

                if (this.currentInputPrompt < 0){
                    this.currentInputPrompt = this.inputPrompts.length - 1;
                }
            }

            this.wasUpPressedLastFrame = true;
        }

        else if (inputs.enter.isDown){     // handles input prompt selections. If "PLAY", we create a
            // boss scene; if "EXIT", we close the window. 
            if (this.currentInputPrompt === 0){
                mainGame.changeScene(new BossScene(drawLayers));
            }
            else{
                close()
            }
        }

        else{
            this.wasDownPressedLastFrame = false;
            this.wasUpPressedLastFrame = false;
        }

        this.refreshPromptCrosshair();


        //check for space inputs to confirm choice
        if (inputs.space.isDown){
            if (this.currentInputPrompt == 1){
                console.log("hmmmmmmmmmmm");
                close();
            }
        }
    }

    

    destroy(){          // destroy method for menuScene 
        this.destroying = true;
        drawLayers.backgroundLayer.removeChild(this.backgroundGraphics);
        drawLayers.foregroundLayer.removeChild(this.leftCursorGraphics);
        drawLayers.foregroundLayer.removeChild(this.rightCursorGraphics);
        for (let element of this.inputPrompts){
            element.destroy();
        }
        delete this;

    }

}