
//a script boss which ends when the dialogue options are exhausted

class TalkativeBossScene extends BossScene{
    //the instance members
    currentMonologue = null;
    currentMonologueIndex = 0;
    monologuesList = []

    name ="";
    textStyle = null;


    constructor(  patternsList, difficultyFunction, monologuesList, name, textStyle){
        super( patternsList, difficultyFunction);

        this.monologuesList = monologuesList;
        this.name = name;
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

                //start a monologue at the bottom of the screen
                this.isPatternRunning = false;

                this.endOfPattern();
                

            }
        }
    }


    //choose whether you want to start a monologue or use a pause handle
    endOfPattern(){

    }
}