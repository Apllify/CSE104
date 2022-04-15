class SquareCirclePattern extends Pattern{

    duration = 10;
    elapsedTime = 0;

    circleCooldown = 1;
    currentCircleCooldown = 1;
    
    squarePattern = null;
    circlePattern = null;


    constructor(drawLayer, player){
        super(drawLayer, player);
    }

    load(){
        this.squarePattern = new SquarePattern(this.drawLayer, this.playerReference, 70, 0.4, 0.6);
        this.squarePattern.activate();
    }

    update(delta, inputs){
        //increment the internal timer
        this.elapsedTime += delta;

        if (this.isDone()){
            return;
        }


        //if the circle cooldown ran out then make a circle pattern
        this.currentCircleCooldown -= delta;
        
        if (this.currentCircleCooldown <= 0){
            this.currentCircleCooldown = this.circleCooldown;

            if (this.circlePattern != null){
                this.circlePattern.destroy();
            }
            this.circlePattern = new CirclePattern(this.drawLayer, this.playerReference, 6, 100, 250, 200);
            this.circlePattern.activate();
        }


        //update both patterns
        if (this.squarePattern != null){
            this.squarePattern.update(delta, inputs);
        }
        if (this.circlePattern != null){
            this.circlePattern.update(delta, inputs);
        }




    }

    destroy(){
        this.squarePattern.destroy();
        if (this.circlePattern != null){
            this.circlePattern.destroy();
        }

    }

    isDone(){
        return (this.elapsedTime >= this.duration);
    }


}

class RainPattern extends Pattern{
    duration = 20;
    elapsedTime = 0;

    cooldown = 2;
    currentCooldown = 2;

    //first one is most recent one, last one is the one that's replace everytime 
    circlePatterns = [];

    constructor(drawLayer, player){
        super(drawLayer, player);
    }

    load(){
        this.circlePatterns[0] = new CirclePattern(this.drawLayer, this.playerReference, 8, 100, 400, 300, 200);
        this.circlePatterns[0].activate();
    }


    update(delta, inputs){
        this.elapsedTime += delta;

        if (this.isDone()){
            return;
        }

        //update both patterns if possible
        for (let pattern of this.circlePatterns){
            if (pattern != null){
                pattern.update(delta);
            }
        }

        //replace the circle pattern with a fresh one once the cooldown runs out 
        this.currentCooldown -= delta;

        if (this.currentCooldown <= 0){
            this.currentCooldown = this.cooldown;

            //destroy the second pattern if needed
            if (this.circlePatterns[1] != null){
                this.circlePatterns[1].destroy();
            }

            //move the first pattern to the second spot 
            this.circlePatterns[1] = this.circlePatterns[0];

            //replace the first pattern
            this.circlePatterns[0] = new CirclePattern(this.drawLayer, this.playerReference, 8, 100, 400, 300, 200);
            this.circlePatterns[0].activate();
        }


    }

    isDone(){
        return (this.elapsedTime >= this.duration)
    }

    destroy(){
        this.circlePatterns[0].destroy();
        delete this.circlePatterns[0];

        this.circlePatterns[1].destroy();
        delete this.circlePatterns[1];
    }
}

