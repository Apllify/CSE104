'use strict';
class SuperBoss{
    // Super-class for all boss scenes that handles basic functionality such as updating and destroying etc.
    
    destroying = false;
    currentObject = null;
   
    pauseScreen = null;
    paused = false;
    
    gameOver = false;

    currentState = 1; // start off as a break (for tensions purposes)

    patternCount = 0;
    breakCount = 0;

    constructor(){
        PIXI.sound.add('pause', '././Sound/pause_button.wav');
    }


    //called once the required assets have been loaded
    load(){
        // creates the player and the first object
        this.playerReference = new Character({x:400, y:300}, drawLayers.activeLayer);
        this.initialize();

        this.currentObject = this.produceBreak(this.breakCount);
        this.breakCount ++;
        this.currentState = 1;

    }




    update(delta, inputs){

        if (this.destroying){
            return;
        }

        if (inputs.escape.isJustDown && !this.gameOver){
            this.pauseHandle();
        }

        if(this.paused){
            this.pauseScreen.update(delta, inputs);
            return;
        }

        //update the player 
        this.playerReference.update(delta, inputs);

        //check whether the player is dead
        if (this.playerReference.health <= 0){
            // when health reaches zero we stop the game
            this.gameOverHandle();
        }

        //update the current object 
        this.currentObject.update(delta, inputs);

        //create a new pattern or break if needed
        if (this.currentObject.isDone() || this.currentObject === null){

            //destroy the current object if necessary
            if (!this.currentObject.destroyed){
                this.currentObject.destroy();
            }

            //checks whether the entire fight is over
            if (this.sceneOver()){
                console.log('over')
                this.sceneOverHandle();
            }

            // request a pattern or a break depending on the current state
            if (this.currentState=== 0){
                this.currentObject = this.produceBreak(this.breakCount);
                this.breakCount ++;
                this.currentState = 1;
            }
            else if (this.currentState === 1){
                this.currentObject = this.producePattern(this.patternCount);
                this.patternCount ++;
                this.currentState = 0;
            }



            

        }

        if (this.currentState === 0){
            this.patternUpdate(delta, inputs);
        }

        else if (this.currentState === 1){
            this.breakUpdate(delta, inputs);
        }
        
    }


    pauseHandle(){
        if (this.paused){
            this.pauseScreen.destroy();
            this.paused = false;
        }

        else{
            this.pauseScreen = new PauseScreen(drawLayers.foregroundLayer, this, ['Resume', 'Restart', 'Quit'],
            {0: 'resume', 1:'restart', 2: 'quit'});
            this.paused = true;
        }
    }

    gameOverHandle(){
        // called when the player dies 
        this.pauseScreen = new PauseScreen(drawLayers.foregroundLayer, this, ['Retry', 'Quit'], {0:'restart', 1:'quit'}, 'Game Over!');
        this.gameOver = true;
        this.paused = true;
    }

    sceneOverHandle(){
        // called when the player beats the boss
        this.pauseScreen = new PauseScreen(drawLayers.foregroundLayer, this, ['Proceed', 'Redo Battle'], {0:'quit', 1:'restart'}, 'Battle Won!');
        this.gameOver = true;
        this.paused = true;
    }

    destroy(){

        this.destroying = true;
        this.playerReference.destroy();

        if (this.paused){
            this.pauseScreen.destroy();
        }

        if (this.currentObject != null && !this.currentObject.destroyed){
            this.currentObject.destroy();
        }
        
        delete this;
    }

    
    //Methods to be defined by inheriting classes 
    
    produceBreak(){ //returns a break object that can be updated
        return;
    }

    producePattern(){//returns an object of type pattern that can be updated
        return;
    }


    patternUpdate(){ //called while any pattern is running 
        return;
    }

    breakUpdate(){ //called while any break is running 
        return;
    }

    initialize(){ //used to set instance properties that are dependent on load() entities such as the player reference

    }

    restart(){ //restarts the boss fight 
        return;
    }

    quit(){ //leaves the boss fight 
        return;
    }

    sceneOver(){ //returns whether the fight is over or not 
        return false;
    }

   

}
