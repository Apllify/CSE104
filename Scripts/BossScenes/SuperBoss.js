'use strict';
class SuperBoss{
    // Super-class for all boss scenes that handles basic functionality such as updating and destroying etc.
    
    destroying = false;
    currentObject = null;
   
    pauseScreen = null;
    paused = false;
    
    gameOver = false;

    constructor(){
        PIXI.sound.add('pause', '././Sound/pause_button.wav');
    }

    startScene(){
        // creates the player and the first object
        this.playerReference = new Character({x:400, y:300}, drawLayers.activeLayer);
        this.initializeObjects();
        this.produceNextObject();
    }

    produceNextObject(){
        return;
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

        
        this.playerReference.update(delta, inputs);

        if (this.playerReference.health <= 0){
            // when health reaches zero we stop the game
            this.gameOverHandle();
        }
        if (this.currentObject.isDone()){
            // objects are destroyed as soon as they are done 
            if (!this.currentObject.destroyed){
                this.currentObject.destroy();
            }

            if (this.sceneOver()){
                this.sceneOverHandle();
            }

            else{
                this.produceNextObject();
            }
        }

        this.currentObject.update(delta,inputs);
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
        this.pauseScreen = new this.pauseScreen(drawLayers.foregroundLayer, this, ['Proceed', 'Redo Battle'], {0:'quit', 1:'restart'}, 'Battle Won!');
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
    restart(){
        return;
    }

    quit(){
        return;
    }

    sceneOver(){
        return false;
    }

   

}
