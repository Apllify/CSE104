"use strict";

class GlitchTransition{
    state = 0; // 0 : hasn't started, 1 : displaying commands , 2:  displaying errors, 3 : done

    textStyle = null;
    errorTextStyle = null;

    backgroundGraphics = null;
    
    mainTextDisplays = [null, null]; //contains two text displays ([0] is commands and [1] is errors)
    cursorTextDisplays = [];

    currentTextDisplayIndex = 0;
    
    lineHeight = 0; //the pixel distance between the top of a character and the bottom of it 

    //the list of all commands as tuples where [0] is the command, and [1] is the duration before going to the next one 
    commands = [
        ['starting "CSE104" ', 3], 
        ["attempting to load ressources", 1],
        ["attempting to load ressources (1)", 3],
        ['loading "Sprites/Rock.png"', 1],
        ['loading "Sprites/Shield.png"', 1],
        ['loading "Sprites/God.json"', 1],
        ['spritesheet loading succesful', 0.5],
        ['loading "Sprites/GrubyZajonc.png"', 2],
        ['loading failed | asset skipped', 0.5],
        ]

    currentCommandIndex = 0;
    currentCommandTimer = 0;

    isCurrentCommandDone = false;

    characterDelay = 0.01; //the delay between the appearance of each individual character in seconds
    currentCharacterIndex = 0;
    currentCharacterTimer = 0;

    elapsedTime = 0;

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
            fill : "#0000FE",
        });
    }

    update(delta, inputs){

        this.elapsedTime += delta;

        this.currentCommandTimer += delta;
        this.currentCharacterTimer += delta;


        //only update if the transition is currently happening 
        if (this.state === 1){
            //update the state if we're at the last line and it is done
            if ((this.currentCommandIndex === (this.commands.length - 1)) && (this.isCurrentCommandDone)){
                this.state = 2;
            }


            //make the last cursor flicker
            this.cursorTextDisplays[this.cursorTextDisplays.length - 1].textEntity.alpha = Math.abs(Math.cos(this.elapsedTime * 3));


            //check whether the current line is done being displayed
            if (this.currentCharacterIndex === (this.commands[this.currentCommandIndex][0].length)){

                //check whether the timer for the current line is also done 
                if (this.currentCommandTimer >= (this.commands[this.currentCommandIndex][1]) ){

                    //reset the timer first things first
                    this.currentCommandTimer = 0;
                    
                    //check whether this was already the very last command to be displayed
                    if (this.currentCommandIndex === this.commands.length - 1){
                        //set the state as finished
                        console.log("should be done  ?");
                        this.state = 2;

                        //set the opacity of the last line to 
                    }
                    else{
                        //move on to the next command index
                        this.currentCommandIndex += 1;
                        this.currentCharacterIndex = 0;

                        //add a line break to the commands display
                        const currentCommandText = this.mainTextDisplays[this.currentTextDisplayIndex].getText();
                        this.mainTextDisplays[this.currentTextDisplayIndex].setText(currentCommandText + "\n");

                        //create a new cursor 
                        const numCursors = this.cursorTextDisplays.length;
                        this.cursorTextDisplays.push(new TextDisplay(drawLayers.transitionForegroundLayer, ">", {x : 50, y: 50 + this.lineHeight * numCursors},
                        this.textStyle));

                        //set the alpha of the second to last cursor to 1
                        this.cursorTextDisplays[numCursors - 1].textEntity.alpha = 1;
                    }

                }
            }
            else{

                //chech whether we can display another character
                if (this.currentCharacterTimer >= this.characterDelay){
                    //reset the timer 
                    this.currentCharacterTimer = 0;

                    //add the character to the current line 
                    const currentCommandsText = this.mainTextDisplays[this.currentTextDisplayIndex].getText();
                    const currentCharacter = this.commands[this.currentCommandIndex][0][this.currentCharacterIndex];

                    this.mainTextDisplays[this.currentTextDisplayIndex].setText(currentCommandsText + currentCharacter);

                    //increment the character index
                    this.currentCharacterIndex += 1;
                }
            }




        }




    }

    startFadeIn(){
        //start the animation
        this.state = 1;


        //setup all of the graphics
        this.backgroundGraphics = new PIXI.Graphics();
        this.backgroundGraphics.beginFill(0x000000);
        this.backgroundGraphics.drawRect(0, 0, 800, 600);
        this.backgroundGraphics.endFill();
        drawLayers.transitionForegroundLayer.addChild(this.backgroundGraphics);

        this.cursorTextDisplays.push(new TextDisplay(drawLayers.transitionForegroundLayer, ">", {x:50, y:50}, this.textStyle));

        this.mainTextDisplays[0] = new TextDisplay(drawLayers.transitionForegroundLayer, "", {x:80, y : 50}, this.textStyle); 
        this.mainTextDisplays[1] = new TextDisplay(drawLayers.transitionForegroundLayer, "", {x:80, y : 50}, this.textStyle); 

        //setup the line height with this temporary value for now 
        this.lineHeight = this.cursorTextDisplays[0].getDimensions().height;

    }

    isFadeInDone(){
        return (this.state === 2);
    }

    //this transition has no fade out, it just pops out when it's done
    startFadeOut(){
        return;
    }

    isFadeOutDone(){
        return (this.state === 2);
    }


    destroy(){
        //destroy all of the graphics that were created
    }


}