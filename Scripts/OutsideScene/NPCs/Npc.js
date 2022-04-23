class Npc{

    //position
    x = 0;
    y = 0;

    //from how far away the player can interact with us 
    detectionRadius = 100;

    //state machine
    currentState = 0;

    currentMonologue = null;

    //in the case we use a 20x20 debug rectangle to display this entity
    debugGraphics = null;


    //universal properties
    playerReference = null;
    drawLayer = null;

    //flag 
    isFirstUpdate = true;


    constructor(drawLayer, playerReference, position){
        this.playerReference=  playerReference;
        this.drawLayer = drawLayer;

        this.x = position.x;
        this.y = position.y;

    }



    //keep track of the state and call the sub-methods accordingly
    update(delta, inputs){

        //setup the graphics if this is the first call to the update method
        if (this.isFirstUpdate){
            this.isFirstUpdate = false;
            this.setupGraphics();
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
                    //change the state
                    this.currentState = 1;
                    this.currentMonologue = this.isInteracted();
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


    destroy(){
        this.destroyGraphics();
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

    idleUpdate(delta, inputs){
        return;
    }

    interactingUpdate(delta, inputs){
        return;
    }

    isInteracted(){ //must return a monologue type object (or null)
        return null;
    }

    isInteractingJustDone(){
        return;
    }




}