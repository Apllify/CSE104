class Npc{

    //position
    x = 0;
    y = 0;

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


    //universal properties
    playerReference = null;
    drawLayer = null;

    //flag 
    isFirstUpdate = true;


    constructor(drawLayer, playerReference, position, detectionRadius=70){
        this.playerReference=  playerReference;
        this.drawLayer = drawLayer;


        this.x = position.x;
        this.y = position.y;
        this.detectionRadius = detectionRadius;

        console.log(this.x);
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


    }

    startNewInteraction(){
        //disable the player intearction prompt if needed ?
        if (this.playerReference.isInteractionPromptEnabled()){
            this.playerReference.disableInteractionPrompt();
        }

        //change the state
        this.currentState = 1;
        this.currentMonologue = this.isInteracted(this.interactionCount);
        this.interactionCount++;
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
        this.debugGraphics = new Rectangle(this.x - 20, this.y - 20, 40, 40).getGraphics(0x00FF00);
        this.drawLayer.addChild(this.debugGraphics);
    }

    destroyGraphics(){ //called when the entity is destroyed
        this.debugGraphics.destroy();
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




}