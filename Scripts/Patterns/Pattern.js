class Pattern{

    drawLayer = null;
    playerReference = null;

    active = false;

    constructor(patternDrawLayer, player){
        this.drawLayer = patternDrawLayer;
        this.playerReference = player;
    }
    
    //called right when the pattern activates and before updating
    load(){

    }

    update(delta, inputs){

    }

    //returns a bool for whether the pattern is over or not
    isDone(){

    }

    //starts the pattern
    activate(){
        this.active= true;
        this.load();
    }

    //destroys every entity associated with the pattern
    destroy(){

    }
}