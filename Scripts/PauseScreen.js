"use strict";

class PauseScreen{
    // initialize a list of the promptTexts and their respective positions.
    // promptTexts = ['RESUME', 'RESTART', 'QUIT'];
    // positions = [200, 300, 400];

    actionsDict = {
        'resume': this.resume,
        'restart': this.restart,
        'quit': this.quit,
        'nextPattern': this.nextPattern,
    }


    // this will contain the prompt TextDisplay objects.
    inputPrompts = [];
    currentInputPrompt = 0;


    
    // this variable tells us which inputPrompt we are selecting by counting the relative number of
    // ups and downs pressed.
    shifts = 0;

    backgroundGraphics = null;
    leftCursorGraphics = null;
    rightCursorGraphics = null;
    
    fontStyle = null;


    
    destroying = false;

    constructor(drawLayer, scene, prompts, actionDict, title){
        // this is similar to what was done in MenuScene
        this.drawLayer = drawLayer;
        this.scene = scene;
        this.promptTexts = prompts;
        this.actionDict = actionDict;
        this.title = title;
        
        let n = prompts.length;
        let x = Math.floor(n / 2);
        let y = n % 2;
        this.positions = [];
        let start = null;
        if (y === 0){
            start = 250 - 100 * (x - 1);
        }
        else{
            start = 300 - 100 * (x)
        }

        for (let i = 0; i < n; i++){
            this.positions.push(start);
            start += 100;
        }
        
        
        this.backgroundGraphics= new PIXI.Graphics();

        //generate a semi-transparent dark overlay
        this.backgroundGraphics.beginFill(0x000000);
        this.backgroundGraphics.drawRect(0, 0, 800, 600);
        this.backgroundGraphics.alpha = 0.5;
        drawLayer.addChild(this.backgroundGraphics);

        //make white font style for black text background
        this.fontStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 36,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        this.titleFont = new PIXI.TextStyle({
            fontFamily: "BrokenConsole",
            fontSize: 100, 
            fontWeight: "bold",
            fill:"#ff0000",
            stroke:"#ff0000",
        });

        if (this.title != null){
            this.title = new TextDisplay(drawLayers.foregroundLayer, this.title, {x:380, y:300}, this.titleFont);
            this.title.centerHorizontallyAt(400);
            this.title.centerVerticallyAt(100);
        }

        for (let i=0; i<this.positions.length; i++){
            // we create the inputPrompts and put them in the specified positions.
            this.inputPrompts.push(new TextDisplay(drawLayers.foregroundLayer, this.promptTexts[i], {x:380, y:300}, this.fontStyle));
            this.inputPrompts[i].centerHorizontallyAt(400);
            this.inputPrompts[i].centerVerticallyAt(this.positions[i]);
        }

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
        drawLayer.addChild(this.leftCursorGraphics);
        drawLayer.addChild(this.rightCursorGraphics);



    }

    refreshPromptCrosshair(){
        if (this.destroying){   // don't try to update if destroy is called.
            return
        }
        // this function puts the left and right arrows on the current input prompt.
        const currentPromptPosition = this.inputPrompts[this.currentInputPrompt].getCenterPosition(); 
        const currentPromptDimensions = this.inputPrompts[this.currentInputPrompt].getDimensions();

        this.leftCursorGraphics.x = currentPromptPosition.x - currentPromptDimensions.width / 2 - 40;
        this.leftCursorGraphics.y = currentPromptPosition.y;

        this.rightCursorGraphics.x = currentPromptPosition.x + currentPromptDimensions.width / 2+ 40;
        this.rightCursorGraphics.y = currentPromptPosition.y;


    }
    
    update(delta, inputs){


        if (this.destroying){
            // don't refresh if we are destroying the PauseScreen
            return
        }
        if (inputs.down.isJustDown){
            // make sure that a button press that lasts multiple frames isn't considered as several
            // different button presses.
            this.shifts += 1;
        }

        else if (inputs.up.isJustDown || inputs.upAlt.isJustDown){
            // make sure that a button press that lasts multiple frames isn't considered as several
            // different button presses
            
            // need to distinguish cases since (-1 % 3 === -1) in javaScript for some reason. 
            if (this.shifts === 0){
                this.shifts = this.positions.length - 1;
            }
            else{
                this.shifts -= 1;
            }
            
        }
        // when we press enter, execute the command corresponding to the currentInputPrompt.
        else if (inputs.enter.isDown){
            this.actionsDict[this.actionDict[this.currentInputPrompt]](this.scene);
        }


        // calculate the currentInputPrompt based on shifts.
        this.currentInputPrompt = this.shifts % this.positions.length;

        this.refreshPromptCrosshair();
    }
    
    destroy(){
        // destroy everything associated to the PauseScreen including itself.
        this.destroying = true;
        if (this.title != null){
            this.title.destroy();
        }
        this.drawLayer.removeChild(this.backgroundGraphics);
        this.drawLayer.removeChild(this.leftCursorGraphics);
        this.drawLayer.removeChild(this.rightCursorGraphics);
        this.drawLayer.removeChild(this.exitJoke);
        for (let element of this.inputPrompts){
            element.destroy();
        }
        delete this;

    }

    nextPattern(scene){
        scene.nextPattern();

    }
    resume(scene){
        // handle the resume command
        scene.pauseHandle();
    }

    restart(scene){
        // handle the restart command 
        scene.restart();

    }

    quit(scene){
        // handle the quit command 
        scene.quit(true); // true here represents the fact that 'Enter' was pressed in the most
                          // recent frame. This information is passed down to the MenuScene so that
                          // a new game isn't started immediately after the MenuScene is created. 
    }
}