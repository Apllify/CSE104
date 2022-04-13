class SquareCirclePattern extends Pattern{

    duration = 10;
    elapsedTime = 0;

    circleCooldown = 2;
    currentCircleCooldown = circleCooldown;
    
    squarePattern = null;
    circlePattern = null;


    constructor(drawLayer, player){
        super(drawLayer, player);
    }

    load(){
        this.squarePattern = new SquarePattern(this.drawLayer, this.playerReference, 80, 0.3, 0.5);
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
            
        }


    }

    isDone(){
        return (this.elapsedTime >= this.duration);
    }


}