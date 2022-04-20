"use strict";
class BossScene{       

    //important boss scene attributes
    playerReference = null;
    currentPattern = null;
    pauseDisplay = null;

    isPatternRunning = true;

    destroying = false;


    drawLayers = null;
    
    paused = false;

    //the list of all pattern instancers
    patternsList = [];

    gameOver = false;


    constructor(drawLayers){
        //create the player 
        this.playerReference = new Character(drawLayers, {x:400,y:300});

        this.drawLayers = drawLayers;

        //instantiate the list of patterns
        this.patternsList.push(() => new SquareWithWave(this.drawLayers.activeLayer, this.playerReference, 'easy'));
        this.patternsList.push(() => new SquareWithWave(this.drawLayers.activeLayer, this.playerReference, 'easy'));


        //start with a random pattern
        const randomPatternIndex = Math.floor(Math.random() * this.patternsList.length);
        this.currentPattern = new PacmanSquare(this.drawLayers.activeLayer, this.playerReference, 'hard')
        this.currentPattern.activate();

        PIXI.sound.add('pause', '././Sound/pause_button.wav');
        PIXI.sound.volume("pause" ,0.03);



    }


    update(delta, inputs){
        if (this.destroying){ // don't try to update if destroy is called.
            return;
        }

        

        if (inputs.escape.isJustDown && !this.gameOver){
            // whenever we press escape, we call pauseHandle to either pause or unpause the game.
            PIXI.sound.play('pause');
            this.pauseHandle(['RESUME', 'RESTART', 'QUIT'], {0:'resume', 1:'restart', 2:'quit'});
        }

        if (this.paused){
            // if the game is paused we only update the pausescreen and leave all other elements the way
            // they were. 
            this.pauseScreen.update(delta, inputs);
            return 
        }

        

        if (this.playerReference.health <= 0){
            this.gameOver = true;
            this.pauseHandle(['RETRY', 'QUIT'], {0:'restart', 1:'quit'}, 'GAME OVER!!');
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
        // Change Pattern 
        this.currentPattern.destroy();

        if (this.paused){
            this.pauseHandle();
        }

        const randomPatternIndex = Math.floor(Math.random() * this.patternsList.length);
        this.currentPattern = this.patternsList[randomPatternIndex](); 
        this.currentPattern.activate();
        
        this.isPatternRunning = true;
    }

    pauseHandle(prompts=null, actionDict=null, title=null){
        // this function is called in two situations: when the game is paused and we choose to resume
        // or whenever we press 'Escape'. If the game was paused, we destroy the pausescreen; otherwise
        // we create a new one.
        if (this.paused){
            this.pauseScreen.destroy();
            this.paused = false;
        }
        else{
            this.pauseScreen = new PauseScreen(drawLayers.foregroundLayer, this, prompts, actionDict, title);
            this.paused = true;
        }
    }

    restart(){
        // restarts this scene.
        this.game.changeScene(new BossScene(drawLayers, this.game));
    }

    quit(){  // if enter was pressed when quitting the game, we need
                                            // to make sure that a newgame isn't started as soon as the
                                            // MenuScene is initialized since the button press may 
                                            // span multiple frames.
        // return to the menuscene.
        this.game.changeScene(new MenuScene(drawLayers, this.game));
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