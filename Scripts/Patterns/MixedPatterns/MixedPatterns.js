class SquareCirclePattern extends Pattern{

    duration = 30;
    elapsedTime = 0;

    circleCooldown = 2;
    currentCircleCooldown = 2;
    
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

    isDone(){
        return (this.elapsedTime >= this.duration);
    }


}

class Rain extends Pattern{
    
}