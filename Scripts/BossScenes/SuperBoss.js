'use strict';
class SuperBoss{
    // Super-class for all boss scenes that handles basic functionality such as updating and destroying etc.

    //the default required assets for every boss
    requiredAssets=  {
        "Shield": "Sprites/Shield.png"
    };
    
    destroying = false;
    currentObject = null;
   
    pauseScreen = null;
    paused = false;
    
    gameOver = false;

    currentState = 1; // start off as a break (for tensions purposes)

    patternCount = 0;
    breakCount = 0;


    walls = []; //the boundaries of the arena
    wallsDisplays = [];

    constructor(){
        PIXI.sound.add('pause', '././Sound/pause_button.wav');
    }


    //called once the required assets have been loaded
    load(background=null){
        // creates the player and the first object

        if (background != null){
            drawLayers.backgroundLayer.addChild(background);
            this.background = background;
        }
        this.playerReference = new Character({x:400, y:300}, drawLayers.activeLayer);
        this.initialize();

        this.currentObject = this.produceBreak(this.breakCount);
        this.breakCount ++;
        this.currentState = 1;


        //initializes the walls of the arena
        this.walls.push(new Rectangle(0, 0, 1, 600));
        this.walls.push(new Rectangle(0, 0, 800, 1));
        this.walls.push(new Rectangle(0, 599, 800, 1));
        this.walls.push(new Rectangle(799, 0, 1, 600));

        //displays the walls of the arena

        for (let wall of this.walls){
            let graphics = wall.getGraphics(0xff0000);
            drawLayers.activeLayer.addChild(graphics);
            this.wallsDisplays.push(graphics);

        }
        // store the scene's projectile color 
        window.sessionStorage.setItem('ProjectileColor', this.projectileColor)
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

        //prevent the player from going outside of the arena
        const oldPlayerHitbox = this.playerReference.getOldHitboxRectangle();
        let playerHitbox = this.playerReference.getHitboxRectangle();

        for (let wall of this.walls){
            if (wall.isColliding(playerHitbox)){
                playerHitbox = wall.simulateCollision(oldPlayerHitbox,playerHitbox);
            }
        }

        this.playerReference.setHitboxRectangle(playerHitbox);

        //check whether the player is dead
        if (this.playerReference.health <= 0){
            // when health reaches zero we stop the game
            this.gameOverHandle();
        }

        //update the current object 
        this.currentObject.update(delta, inputs);

        //create a new pattern or break if needed
        if (this.currentObject.isDone() || this.currentObject === null){
            if(this.gameOver){
                return
            }
            //destroy the current object if necessary
            if (!this.currentObject.destroyed){
                this.currentObject.destroy();
            }

            //checks whether the entire fight is over
            if (this.sceneOver()){
                this.sceneOverHandle();
                return;
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
        this.sceneOverAction();
        this.pauseScreen = new PauseScreen(drawLayers.foregroundLayer, this, ['Proceed', 'Redo Battle'], {0:'nextScene', 1:'restart'}, 'Battle Won!');
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

        //destroy all of the walls
        for (let wallsDisplay of this.wallsDisplays){
            wallsDisplay.destroy();
        }
        
        delete this;
    }

    
    //Methods to be defined by inheriting classes 
    sceneOverAction(){
        return;
    }

    produceNextScene(){ // Game Progression
        return;
    }
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
