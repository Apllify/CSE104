'use strict';
class Npc{

    //position
    x = 0;
    y = 0;

    previousX = 0;
    previousY = 0;



    //from how far away the player can interact with us 
    detectionRadius = 70;

    //state machine
    currentState = 0;

    currentMonologue = null;


    //number of times we've been interacted with
    interactionCount = 0;

    //in the case we use a 40x40 debug rectangle to display this entity
    destroyed = false;
    debugGraphics = null;

    //the hitbox rectangle which is not necessarily present for every single entity
    hitbox = null;
    previousHitbox = null;


    //universal properties
    playerReference = null;
    drawLayer = null;

    //in case we want to implement collision with more than just the player (unused)
    extraColliders = [];
    wasCollidingLastFrame = false; 
    isSolid = true;  //whether the player can go through this npc (detects collision but doesn't act on it)

    //flag 
    isFirstUpdate = true;


    constructor(drawLayer, playerReference, position, detectionRadius=70){
        this.playerReference=  playerReference;
        this.drawLayer = drawLayer;


        this.x = position.x;
        this.y = position.y;
        this.detectionRadius = detectionRadius;


    }



    //keep track of the state and call the sub-methods accordingly
    update(delta, inputs){

        //setup the graphics if this is the first call to the update method
        if (this.isFirstUpdate){
            
            this.isFirstUpdate = false;
            this.setupGraphics();
            this.setupHitbox();

        }

        //don't update if entity is destroyed
        if (this.destroyed){
            return; 
        }

        //update depending on the state 
        if (this.currentState === 0){
            this.idleUpdate(delta, inputs);

            //check for player inputs
            if (inputs.enter.isJustDown){
                const xDistance = this.playerReference.x - this.x;
                const yDistance = this.playerReference.y - this.y;

                const totalDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

                if (totalDistance <= this.detectionRadius){
                    this.startNewInteraction();
                }
            }
        }
        else if (this.currentState === 1){
            this.interactingUpdate(delta, inputs);

            //update the current monologue
            if (this.currentMonologue !== null){
                this.currentMonologue.update(delta, inputs);
            }

            
            //check whether the monologue is over or nonexistent to go back to idle
            if (this.currentMonologue === null || this.currentMonologue.isDone()){
                this.currentState = 0;
                this.isInteractingJustDone();
            }
        }




        //check for collisions with the player (and the extra colliders (unused)) 
        if (this.hitbox !== null){
            //by default, we never prioritize the player's movement
            // console.log(this.previousHitbox.x);

            if (this.hitbox.isColliding(this.playerReference.getHitboxRectangle())){

                //call our local method when colliding
                if (!this.wasCollidingLastFrame){
                    this.wasCollidingLastFrame = true;
                    this.justCollided();
                }


                if (this.isSolid){
                    //if the player actually moved into us, boot him out
                    if (this.previousHitbox == null){
                        this.previousHitbox = {x: this.x, y: this.y};
                    }
                    if ((this.previousHitbox.x === this.hitbox.x) && (this.previousHitbox.y === this.hitbox.y)){
                        const newPlayerHitbox = this.hitbox.simulateCollision(this.playerReference.getOldHitboxRectangle(), this.playerReference.getHitboxRectangle());
                        this.playerReference.setHitboxRectangle(newPlayerHitbox);
                    }
                    
                    else { //other wise, push him in our movement direction
                        const playerCoords= this.playerReference.getPosition();
                        let displacementDir = new Vector(playerCoords.x - this.x, playerCoords.y - this.y);

                        //snap the displacement direction to one of the 45° directions
                        displacementDir = displacementDir.snap45();

                        //const imaginaryPlayerPos = this.playerReference.getPosition().add(movementDir);
                        const imaginaryPlayerHitbox = this.playerReference.getOldHitboxRectangle();
                        imaginaryPlayerHitbox.x += displacementDir.x * 10;
                        imaginaryPlayerHitbox.y += displacementDir.y * 10;





                        const newPlayerHitbox = this.hitbox.simulateCollision(imaginaryPlayerHitbox, this.playerReference.getHitboxRectangle());
                        this.playerReference.setHitboxRectangle(newPlayerHitbox);
                    }
                }

            }
            else{
                this.wasCollidingLastFrame = false;
            }



        }

        //keep track of the previous positions
        this.previousX = this.x;
        this.previousY = this.y;

        this.previousHitbox = this.hitbox;


    }

    startNewInteraction(){
        //disable the player prompt if needed ?
        if (this.playerReference.isPromptEnabled()){
            this.playerReference.disablePrompt();
        }

        //change the state
        this.currentMonologue = this.isInteracted(this.interactionCount);

        if (this.currentMonologue !== null){
            this.currentState = 1;
            this.interactionCount++;
        }

    }


    destroy(){
        if (!this.destroyed){
            this.destroyGraphics();

            if (this.currentMonologue !== null){
                this.currentMonologue.destroy();
            }
            
            this.destroyed = true;
        }
    }



    //TO BE OVERRIDEN by subclasses
    //this is how we create individuality in subclasses of this program

    setupGraphics(){ //creates the display (be it sprite or rectangle) of this entity
        return;
    }

    refreshGraphics(){ //only necessary for moving entities
        return;
    }

    destroyGraphics(){ //called when the entity is destroyed
        this.debugGraphics.destroy();
    }


    setSolid(bool){
        this.isSolid = bool;
    }


    setupHitbox(){ // to be overridden
        return;
    }

    idleUpdate(delta, inputs){
        return;
    }

    interactingUpdate(delta, inputs){
        return;
    }

    isInteracted(index){ //must return a monologue type object (or null)
        return null;
    }

    isInteractingJustDone(){
        return;
    }

    //called once at the start of every collision
    justCollided(){
        return;
    }




}