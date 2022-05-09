'use strict';
class SeekerPattern extends Pattern{

    x = 0;
    y = 0;

    vx = 0;
    vy = 0;

    destroying = false;

    maxSpeed = 550;

    acceleration = 10;
    lifeSpan = 10;
    dps = 30;

    friction = 200;

    color = 0x000000;

    elapsedTime = 0;
    phaseDuration = 3;

    projectileEntity = null;

    constructor(patternDrawLayer, player, coordinates, acceleration, lifeSpan, dps= 30, maxSpeed = 550, 
        friction = 200, startingPhase= 0, color=0x000000){
        super(patternDrawLayer, player);


        this.x = coordinates.x;
        this.y = coordinates.y;

        this.acceleration = acceleration;
        this.lifeSpan = lifeSpan;

        this.dps = dps;
        this.maxSpeed = maxSpeed;
        this.friction = friction;

        this.color = color;

        this.elapsedTime = this.phaseDuration * startingPhase;
    }

    load(){
        //instantiate the main projectile
        const projectileCoords = {x: this.x, y:this.y};
        this.projectileEntity = new Projectile(this.drawLayer, this.playerReference, projectileCoords, 0,
            new Vector(0, 0), {x:50, y:50}, this.dps, this.color );

    }

    update(delta, inputs){

        if (this.destroying){
            return;
        }
        //update the internal timer
        this.elapsedTime += delta;

        //get the current position from the projectile
        this.x = this.projectileEntity.x;
        this.y = this.projectileEntity.y;

        //set the with a slight randomness every frame
        let targetX = 0;
        let targetY = 0;

        if (this.elapsedTime % (this.phaseDuration * 2) < this.phaseDuration){ //phase 0 : direct seeking high acc
            targetX = this.playerReference.x;
            targetY = this.playerReference.y;

            const xOffset= Math.random() * 150 - 75;
            const yOffset = Math.random() * 150 - 75;

            targetX += xOffset;
            targetY += yOffset;

        }
        else{ //phase 1: predictive seeking
            targetX = this.playerReference.x + (this.playerReference.xVelocity * 5);
            targetY = this.playerReference.y + (this.playerReference.yVelocity * 5);

            const xOffset = Math.random() * 200 - 100;
            const yOffset = Math.random() * 200 - 100;

            targetX += xOffset;
            targetY += yOffset;

        }

        //compute the new direction vector
        let directionVector = new Vector(targetX - this.x, targetY - this.y);
        directionVector.normalize();


        //calculate the current speeds of the projectile on both axis

        let currentVx = this.projectileEntity.direction.x * this.projectileEntity.speed;
        let currentVy = this.projectileEntity.direction.y * this.projectileEntity.speed;


        let velocityVector = new Vector(currentVx, currentVy);


        //apply friction to the velocity vector
        if (velocityVector.getNorm() !== 0){
            velocityVector.rescale( (velocityVector.getNorm() - delta * this.friction) / velocityVector.getNorm());
        }

        //increment the speed on both axis by the acceleration
        velocityVector.x += (directionVector.x * this.acceleration * delta);
        velocityVector.y += (directionVector.y * this.acceleration * delta);

        let velocity = velocityVector.getNorm();
        velocityVector = velocityVector.normalize();

        console.log(velocity);




        //prevent the velocity vector from going past max speed in norm
        velocity = Math.min(velocity, this.maxSpeed);


        //set the new velocity of the projectile
        this.projectileEntity.changeDirection(velocityVector);
        this.projectileEntity.changeSpeed(velocity);




        //update the projectile 
        this.projectileEntity.update(delta);



    }

    isDone(){
        return (this.elapsedTime >= this.lifeSpan);
    }

    destroy(){
        this.destroying = true;

        this.projectileEntity.destroy();
        delete this;
    }
}