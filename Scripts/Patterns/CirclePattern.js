"use strict";
class CirclePattern extends Pattern{

    projectiles = [];

    projectileCount = 1;
    minSpeed = 200;
    maxSpeed = 500;
    ringRadius = 200;
    destroying = false;
    dps = 30;

    //centered ring of projectiles around the player
    constructor(patternDrawLayer, player, projectileCount, minSpeed, maxSpeed, ringRadius, dps = 30){
        super(patternDrawLayer, player);

        this.projectileCount= projectileCount;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;

        this.ringRadius = ringRadius;
        this.dps = dps;
    }

    //called right before the first update method
    load(){

        let currentAngle = 0;

        let relativeX = 0;
        let relativeY = 0;

        let relativeCoords = new Vector(0, 0);
        let realCoords = new Vector(0, 0);

        let speed = this.minSpeed;


        for(let i = 0; i < this.projectileCount; i++){
            //generate the position of the projectile relative to the center of the screen
            currentAngle = 2 * Math.PI  * i/this.projectileCount;

            relativeX =  this.ringRadius * Math.cos(currentAngle);
            relativeY = this.ringRadius * Math.sin(currentAngle);

            relativeCoords.x = -relativeX;
            relativeCoords.y = -relativeY;

            realCoords = relativeCoords.add(new Vector(this.playerReference.x, this.playerReference.y));

            //generate a random speed between the min and the max
            speed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;



            //create the projectile at that position
            this.projectiles.push(new Projectile(this.drawLayer, this.playerReference, realCoords, speed, relativeCoords, undefined, this.dps));

        }
    }


    update(delta, inputs){
        if (this.destroying){ // don't try to update if destroy has been called
            return 
        }
        if (this.active){
            //update every single projectile in the list
            for(let i = 0; i<this.projectiles.length;i++){
                this.projectiles[i].update(delta);
            }
        }


    }


    isDone(){
        //checks whether every projectile is out the screen
        let flag = true;

        for (let projectile of this.projectiles){
            if (!projectile.isOutOfBounds()){
                flag = false;
            }
        }

        return flag;
    }


    destroy(){
        // destroy every projectile and the pattern itself.
        this.destroying = true;
        for (let projectile of this.projectiles){
            projectile.destroy();
        }
        delete this;
    }
}