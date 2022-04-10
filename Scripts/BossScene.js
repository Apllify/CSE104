class BossScene{       

    playerReference = null;

    currentPattern = null;
    
    pauseDisplay = null;

    isPatternRunning = true;
    
    constructor(drawLayers){
        //create the player 
        app.backgroundColor = '#000000'
        this.playerReference = new Character(drawLayers, {x:400,y:300});


        //create a circle pattern to start
        this.currentPattern = new CirclePattern(drawLayers.activeLayer, this.playerReference, 
            10, 200, 500, 300);
        this.currentPattern.activate();
    }


    update(delta, inputs){
        if (this.isPatternRunning){
            //update both the player and the boss pattern
            this.playerReference.update(delta, inputs);
            this.currentPattern.update(delta, inputs);

            //if the pattern is over, switch to pause phase
            if (this.currentPattern.isDone()){
                this.createPausePrompt();
                this.isPatternRunning = false;
            }
        }
        else{

        }


    }

    createPausePrompt(){
        this.pauseDisplay;
    }
}