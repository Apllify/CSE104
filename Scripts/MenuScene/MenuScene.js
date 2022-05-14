"use strict";
class MenuScene{


    inputPrompts = [];  
    currentInputPrompt = 0;

    backgroundGraphics = null;

    leftCursorGraphics = null;
    rightCursorGraphics = null;

    startFontStyle = null;
    menuFontStyle = null;

    //to keep track of the help joke
    helpJokeStarted = false;
    helpJokeStartTime = 0;
    helpJokeEnded = false

    //the overall internal timer
    elapsedTime = 0;

    exitJokeLines = [
        "There is no escape...", 
        "Face your fears...",
        "Know what you must do...", 
        "Victory comes at a cost...", 
        "Don't trust The Game...",
        "Don't trust The King...",
        "Your heart is your compass...",
        "The Boulder has answers...",
        "Deadweight...",
        "Don't buy into their lies..."]

    currentExitJokeIndex = -1;

    

    // these variables allow us to make sure that a button press that spans multiple frames isn't
    // considered as several different button presses in the manuScene.

    
    destroying = false;

    constructor(){
        //setup the fonts that we're gonna be using
        this.startFontStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 100,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",

        }

        );

        this.menuFontStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 36,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        this.exitFontStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 36,
            fontWeight : "bold",
            fill : "#ff0000",
            stroke : "#ff0000",
        });

    }


    
    load(){
        //create a background graphics
        this.backgroundGraphics= new PIXI.Graphics();


        this.backgroundGraphics.beginFill(0x000000);
        this.backgroundGraphics.drawRect(0, 0, 800, 600);

        drawLayers.backgroundLayer.addChild(this.backgroundGraphics);
        
        this.backgroundMusic = PIXI.sound.Sound.from({
            url: '././Music/MenuMusic.wav',
            preload: true,
            loaded: function(err, sound) {
                // sound.filters = [
                //     new PIXI.sound.filters.TelephoneFilter(),
                // ];
                sound.volume = 0.1;
                sound.filters = [new PIXI.sound.filters.ReverbFilter(1, 5)];
                sound.play();

                setTimeout(function () {
                    console.log('here')
                    sound.play();
                }, 50);
            }
        });
        PIXI.sound.add('flip', '././Sound/flip_menu.wav');
        PIXI.sound.add('exit', '././Sound/exit_joke.wav');
        PIXI.sound.add('play', '././Sound/hit_play.wav');

        PIXI.sound.volume("flip", 0.03);
        PIXI.sound.volume("exit", 0.03);
        PIXI.sound.volume("play", 0.03);

        //instantiate the text boxes
        this.exitJoke = new FadeText(drawLayers.foregroundLayer, "", {x:380, y:500}, this.exitFontStyle, 2);
        this.exitJoke.centerHorizontallyAt(400);
        this.exitJoke.centerVerticallyAt(550);

        this.inputPrompts.push(new TextDisplay(drawLayers.foregroundLayer, "PLAY", {x:0, y:0}, this.startFontStyle));
        this.inputPrompts[0].centerHorizontallyAt(400);
        this.inputPrompts[0].centerVerticallyAt(200);

        this.inputPrompts.push(new TextDisplay(drawLayers.foregroundLayer, "HOW TO PLAY", {x:0, y:0}, this.menuFontStyle));
        this.inputPrompts[1].centerHorizontallyAt(400);
        this.inputPrompts[1].centerVerticallyAt(350);

        this.inputPrompts.push(new TextDisplay(drawLayers.foregroundLayer, "EXIT", {x:0, y:0}, this.menuFontStyle));
        this.inputPrompts[2].centerHorizontallyAt(400);
        this.inputPrompts[2].centerVerticallyAt(450);

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

        //keep track of the internal timer 
        this.elapsedTime += delta;
        
        //check for down and up inputs to select prompts and update the alpha value for fading texts.
        this.exitJoke.update(delta, inputs);

        if (inputs.down.isJustDown){
            // make sure that a button press that lasts multiple frames isn't considered as several
            // different button presses.
            PIXI.sound.play('flip')
            this.currentInputPrompt += 1;


            if (this.currentInputPrompt > this.inputPrompts.length-  1){
                this.currentInputPrompt = 0;
            }

            if (this.helpJokeEnded && this.currentInputPrompt == 1){
                this.currentInputPrompt = 2;
            }

        }


        if (inputs.up.isJustDown || inputs.upAlt.isJustDown){
            // make sure that a button press that lasts multiple frames isn't considered as several
            // different button presses.
            PIXI.sound.play('flip');
            this.currentInputPrompt -= 1;

            if (this.currentInputPrompt < 0){
                this.currentInputPrompt = this.inputPrompts.length - 1;
            }

            if (this.helpJokeEnded && this.currentInputPrompt == 1){
                this.currentInputPrompt = 0;
            }

        }



        if (inputs.enter.isJustDown){     // handles input prompt selections. If "PLAY", we create a
            // boss scene, for example.
            if (this.currentInputPrompt === 0){
                PIXI.sound.play('play')

                //either load the game or the name input scene depending on whether the player has already chosen
                if (window.localStorage.getItem("username") === null){
                    mainGame.changeScene(new NameInputScene(), new PixelTransition(0.5, 0.5));
                }
                else{
                    mainGame.changeScene(new PreIntroOutsideScene());
                    //mainGame.startTransition(new PixelTransition(1, 5));
                }
            }
            else if (this.currentInputPrompt === 1){

                //only allow the player to click the button once 
                if (!this.helpJokeStarted){

                    //play a feedback sound effect
                    PIXI.sound.play('exit');


                    this.helpJokeStarted = true;
                    this.inputPrompts[1].destroy();
                    this.inputPrompts[1] = new FadeText(drawLayers.foregroundLayer, "HOW TO PLAY", {x:0, y:0}, this.menuFontStyle, 1);
                    this.inputPrompts[1].centerHorizontallyAt(400);
                    this.inputPrompts[1].centerVerticallyAt(350);
                    this.inputPrompts[1].initiate();
                    this.helpJokeStartTime = this.elapsedTime;
                }

            }
            else if (this.currentInputPrompt === 2){
                PIXI.sound.play('exit');

                //move on to the next exit joke
                this.currentExitJokeIndex = Math.min(this.currentExitJokeIndex +1, this.exitJokeLines.length - 1);

                //set the new text
                this.exitJoke.setText(this.exitJokeLines[this.currentExitJokeIndex]);
                this.exitJoke.centerHorizontallyAt(400);

                this.exitJoke.initiate();
            }
            
        }

        //update the second prompt in case it's actually a fade text 
        if (this.helpJokeStarted){
            this.inputPrompts[1].update(delta);

            if (this.inputPrompts[1].isDone() && !this.helpJokeEnded){
                //slowly ease the exit button upwards
                if (this.destroying){
                    return 
                }
                const newYPosition = 350 + Math.cos( (this.elapsedTime - this.helpJokeStartTime)   )  * 100;
                this.inputPrompts[2].centerVerticallyAt(newYPosition);

                if (newYPosition <= 350){
                    this.helpJokeEnded = true;

                    //set the cursor to an actually valid position since help doesn't exist anymore
                    if (this.currentInputPrompt == 1){
                        this.currentInputPrompt = 2;
                    }
                }
            }
        }

        

        this.refreshPromptCrosshair();



    }

    unload(){
        this.backgroundMusic.pause()
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
        this.exitJoke.destroy();
        delete this;

    }

}