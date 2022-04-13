"use strict";
class BossScene{       

    //important boss scene attributes
    playerReference = null;
    currentPattern = null;
    pauseDisplay = null;

    isPatternRunning = true;

    destroying = false;

    wasEscapePressedLastFrame = false;

    drawLayers = null;
    
    paused = false;

    //DEBUG variables 
    telegraph = null;


    constructor(drawLayers, game){
        //create the player 
        this.game = game;
        this.playerReference = new Character(drawLayers, {x:400,y:300});

        this.drawLayers = drawLayers;


        //create a square pattern to start
        this.currentPattern = new CirclePattern(this.drawLayers.activeLayer, this.playerReference, 10, 200, 400, 300 );
        this.currentPattern.activate();

        //create a fading text for testing
        this.telegraph = new Telegraph(this.drawLayers.activeLayer, {x:200, y:200}, 10);
    }


    update(delta, inputs){
        if (this.destroying){ // don't try to update if destroy is called.
            return 
        }
        if (inputs.escape.isDown){
            // whenever we press escape, we call pauseHandle to either pause or unpause the game.
            // the conditional is because one button press may span more than one frame.
            if (!this.wasEscapePressedLastFrame){
                this.pauseHandle(['RESUME', 'RESTART', 'QUIT'], {0:'resume', 1:'restart', 2:'quit'});
            }
            this.wasEscapePressedLastFrame = true;  
        }
        else{
            // if escape wasn't pressed in this frame... 
            this.wasEscapePressedLastFrame = false;
        }
        if (this.paused){
            // if the game is paused we only update the pausescreen and leave all other elements the way
            // they were. 
            this.pauseScreen.update(delta, inputs);
            return 
        }

        if (this.isPatternRunning){
            //update both the player and the boss pattern
            this.playerReference.update(delta, inputs);
            this.currentPattern.update(delta, inputs);

            //if the pattern is over, switch to pause phase
            if (this.currentPattern.isDone()){
                this.pauseHandle(['CONTINUE', 'QUIT'], {0:'nextPattern', 1:'quit'});
                this.isPatternRunning = false;
            }
        }
        else{

        }


    }

    nextPattern(){
        this.currentPattern.destroy();
        this.currentPattern = new SquarePattern(drawLayers.activeLayer, this.playerReference, 80);
    }

    pauseHandle(prompts, actionDict){
        // this function is called in two situations: when the game is paused and we choose to resume
        // or whenever we press 'Escape'. If the game was paused, we destroy the pausescreen; otherwise
        // we create a new one.
        if (this.paused){
            this.pauseScreen.destroy();
            this.paused = false;
        }
        else{
            this.pauseScreen = new PauseScreen(drawLayers.foregroundLayer, this, prompts, actionDict);
            this.paused = true;
        }
    }

    restart(){
        // restarts this scene.
        this.game.changeScene(new BossScene(drawLayers, this.game));
    }

    quit(wasEnterPressedLastFrame = false){  // if enter was pressed when quitting the game, we need
                                            // to make sure that a newgame isn't started as soon as the
                                            // MenuScene is initialized since the button press may 
                                            // span multiple frames.
        // return to the menuscene.
        this.game.changeScene(new MenuScene(drawLayers, this.game, wasEnterPressedLastFrame));
    }

    destroy(){
        // destroy everything created by this scene
        if (this.paused){
            this.pauseScreen.destroy();
        }
        this.destroying = true;
        this.currentPattern.destroy();
        this.playerReference.destroy();
        delete this;


    }
}