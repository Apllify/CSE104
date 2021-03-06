"use strict";

class GlitchTransition{
    state = 0; // 0 : hasn't started, 1 : displaying commands , 2:  displaying errors, 3 : waiting a little bit, 4 : done

    textStyle = null;
    errorTextStyle = null;

    backgroundGraphics = null;
    
    mainTextDisplays = [null, null]; //contains two text displays ([0] is commands and [1] is errors)
    cursorTextDisplays = [];

    currentTextDisplayIndex = 0;
    
    lineHeight = 0; //the pixel distance between the top of a character and the bottom of it 

    //[0] is the command for state 1, [1] is commands for state 2.
    //for every command : [0] is the text content, [1] is the duration on screen
    commands = [
        [
        ['starting "CSE104" ', 3],
        ["live reload enabled", 0.5],
        ["attempting to load ressources", 1],
        ["accessing cached ressources", 1],
        ['loading "Sprites/Rock.png"', 0.4],
        ['loading "Sprites/Shield.png"', 0.6],
        ['loading "Sprites/God.json"', 0.7],
        ['loading "Sprites/Chair.png"', 0.4],
        ['sprite loading succesful', 2],
        ['loading "Scripts/Character.js"', 0.6],
        ['loading "Scripts/Game.js"', 0.4],
        ['loading "Scripts/HealthBar.js"', 0.7],
        ['loading "Scripts/PauseScreen.js"', 0.4],
        ['loading "Scripts/Script.js', 0.3],
        ['loading "Scripts/MenuScene/FadeText.js"', 0.6],
        ['loading "Scripts/MenuScene/NameInputScene.js"', 0.8],
        ['loading "Scripts/MenuScene/TextDisplay.js"', 0.3],
        ['script loading succesful', 2],
        ['attempting to load sound effects', 2],
        ['loading "Sound/start_game.wav"', 2],
        ['initializing background ', 0.5],
        ["loading...", 0.5],
        ["loading...", 0.3],
        ["loading...", 0.4],
        ['initializing player entity ', 3],
        ['loading... ', 0.5],
        ['loading...', 0.5],
        ['loading...', 0.5],


        ],

        [
            ["error : could not set properties of undefined", 2],
            ["warning : missing argument #1 playerPosition", 1],
            ["error : Game.js file corrupted", 1],
            ["error : IntroScene.js file corrupted", 1],
            ["error : Character.js file corrupted", 0.5],
            ["error : HealthBar.js file corrupted", 0.3],
            ["error : PauseScreen.js file corrupted", 0.7],
            ["warning : attempting to recover scripts", 2],
            ["warning : script recovery failed", 1]


        ]
    ]

    currentCommandIndex = 0;
    currentCommandTimer = 0;

    isCurrentCommandDone = false;

    characterDelay = 0.01; //the delay between the appearance of each individual character in seconds
    currentCharacterIndex = 0;
    currentCharacterTimer = 0;

    elapsedTime = 0;


    waitingDuration = 4;
    waitingTimer = 0;

    constructor(){

        //set up the two font colors 
        this.textStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#00B100",
        });

        this.errorTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#FE0000",
        });
    }

    update(delta, inputs){

        this.elapsedTime += delta;

        this.currentCommandTimer += delta;
        this.currentCharacterTimer += delta;

        //if animation running 
        if (this.state === 1 || this.state === 2){
            //the index of this.commands in which our commands are situated
            const phaseIndex = this.state - 1;

            //make the last cursor flicker
            this.cursorTextDisplays[this.cursorTextDisplays.length - 1].textEntity.alpha = Math.abs(Math.cos(this.elapsedTime * 3));



            //check whether the end of the current commands list has been exhausted
            if ( (this.currentCommandIndex === (this.commands[phaseIndex].length - 1) )  && this.isCurrentCommandDone){
                this.state++;
                this.currentTextDisplayIndex++;
                this.currentCommandIndex = 0;
                this.currentCharacterIndex = 0;

                const numCursors = this.cursorTextDisplays.length;

                //position the new text box at the proper height 
                if (this.state === 2){
                    this.mainTextDisplays[1].textEntity.y = this.mainTextDisplays[0].textEntity.y+this.mainTextDisplays[0].getDimensions().height;

                    //create a new cursor 
                    const textStyle = (this.state === 1) ? this.textStyle : this.errorTextStyle;
                    this.cursorTextDisplays.push(new TextDisplay(drawLayers.transitionForegroundLayer, ">", {x : 50, y: 50 + this.lineHeight * numCursors},
                    textStyle));

                    //play the error sound effect
                    PIXI.sound.play("error");


                }

                //set the alpha of the second to last cursor to 1
                this.cursorTextDisplays[numCursors - 1].textEntity.alpha = 1;




                return;
            }




            //check whether the current line is done being displayed
            if (this.currentCharacterIndex === (this.commands[phaseIndex][this.currentCommandIndex][0].length)){


                //check whether the timer for the current line is also done 
                if (this.currentCommandTimer >= (this.commands[phaseIndex][this.currentCommandIndex][1]) ){


                    //play neat new line sound effect
                    if (this.state === 1){
                        PIXI.sound.play("command");
                    }
                    else if (this.state === 2){
                        PIXI.sound.play("error");
                    }

                    //reset the timer first things first
                    this.currentCommandTimer = 0;

                    //since we're starting a new line we can set done to false
                    this.isCurrentCommandDone = false;
                    
                    //move on to the next command index
                    this.currentCommandIndex += 1;
                    this.currentCharacterIndex = 0;

                    //add a line break to the commands display
                    const currentCommandText = this.mainTextDisplays[this.currentTextDisplayIndex].getText();
                    this.mainTextDisplays[this.currentTextDisplayIndex].setText(currentCommandText + "\n");

                    //create a new cursor 
                    const numCursors = this.cursorTextDisplays.length;
                    const textStyle = (this.state === 1) ? this.textStyle : this.errorTextStyle;
                    this.cursorTextDisplays.push(new TextDisplay(drawLayers.transitionForegroundLayer, ">", {x : 50, y: 50 + this.lineHeight * numCursors},
                    textStyle));

                    //set the alpha of the second to last cursor to 1
                    this.cursorTextDisplays[numCursors - 1].textEntity.alpha = 1;


                    //check if the text now goes past the max length
                    if (this.cursorTextDisplays.length * this.lineHeight > 450){
                        //remove the first non destroyed element and shift the rest downwards
                        let hasDestroyed = false;
                        
                        for (let cursorDisplay of this.cursorTextDisplays){
                            if (!cursorDisplay.destroyed){
                                if (!hasDestroyed){
                                    console.log(cursorDisplay.textEntity.y);
                                    hasDestroyed = true;
                                    cursorDisplay.destroy();
                                }
                                else{
                                    cursorDisplay.textEntity.y -= this.lineHeight;

                                }
                            }
                        }

                        //remove the first element from the list 
                        this.cursorTextDisplays.shift();

                        //check if we can remove a line from the first container or not 
                        if (this.mainTextDisplays[0] !== ""){
                            const currentText = this.mainTextDisplays[0].getText();
                            const lineBreakIndex = currentText.indexOf("\n");
                            const newText = currentText.substring(lineBreakIndex + 1);

                            this.mainTextDisplays[0].setText(newText);
                            this.mainTextDisplays[1].textEntity.y = 50 + this.mainTextDisplays[0].getDimensions().height;

                        }
                        //otherwise, we simply remove one line from the second container
                        else{
                            const currentText = this.mainTextDisplays[1].getText();
                            const lineBreakIndex = currentText.indexOf("\n");
                            const newText = currentText.substring(lineBreakIndex + 1);

                            this.mainTextDisplays[1].setText(newText);
                        }

                    }

                }
            }
            else{

                //check whether we can display another character
                if (this.currentCharacterTimer >= this.characterDelay){
                    //reset the timer 
                    this.currentCharacterTimer = 0;

                    //add the character to the current line 
                    const currentCommandsText = this.mainTextDisplays[this.currentTextDisplayIndex].getText();
                    const currentCharacter = this.commands[phaseIndex][this.currentCommandIndex][0][this.currentCharacterIndex];

                    this.mainTextDisplays[this.currentTextDisplayIndex].setText(currentCommandsText + currentCharacter);

                    //increment the character index
                    this.currentCharacterIndex += 1;

                    //if this was the last character, set the current command to done 
                    if (this.currentCharacterIndex === this.commands[phaseIndex][this.currentCommandIndex][0].length){
                        this.isCurrentCommandDone = true;
                    }
                }
            }








        }
        else if (this.state === 3){
            this.waitingTimer += delta;

            if (this.waitingTimer >= this.waitingDuration){
                //play an exit sound effect
                PIXI.sound.play("play");    
                this.state = 4;
            }
        }





    }

    startFadeIn(){
        //start the animation
        this.state = 1;

        //setup all the sound effects
        PIXI.sound.add("command", "././Sound/new_cmd.wav");
        PIXI.sound.volume("command", 0.3);

        PIXI.sound.add("error", "././Sound/new_error.wav");
        PIXI.sound.volume("error", 0.6);




        //setup all of the graphics
        this.backgroundGraphics = new PIXI.Graphics();
        this.backgroundGraphics.beginFill(0x000000);
        this.backgroundGraphics.drawRect(0, 0, 800, 600);
        this.backgroundGraphics.endFill();
        drawLayers.transitionForegroundLayer.addChild(this.backgroundGraphics);

        this.cursorTextDisplays.push(new TextDisplay(drawLayers.transitionForegroundLayer, ">", {x:50, y:50}, this.textStyle));

        this.mainTextDisplays[0] = new TextDisplay(drawLayers.transitionForegroundLayer, "", {x:80, y : 50}, this.textStyle); 
        this.mainTextDisplays[1] = new TextDisplay(drawLayers.transitionForegroundLayer, "", {x:80, y : 50}, this.errorTextStyle); 

        //setup the line height with this temporary value for now 
        this.lineHeight = this.cursorTextDisplays[0].getDimensions().height;

        //play an initial new command sound effect
        PIXI.sound.play("command");


    }

    isFadeInDone(){
        return (this.state === 4);
    }

    //this transition has no fade out, it just pops out when it's done
    startFadeOut(){
        return;
    }

    isFadeOutDone(){
        return (this.state === 4);
    }


    destroy(){
        //destroy all of the graphics that were created
        this.backgroundGraphics.destroy();

        this.mainTextDisplays[0].destroy();
        this.mainTextDisplays[1].destroy();

        for (let cursorDisplay of this.cursorTextDisplays){
            cursorDisplay.destroy();
        }
    }


}