"use strict";
class SquarePattern extends Pattern{

    currentPhase = 0;
    //phase 0 : zoom in around the player 
    //phase 1 : move around randomly while stretching 

    //phase 0 attributes
    shrinkSpeed = 6;
    phaseZeroEndTime = 0; //to be set dynamically

    //phase 1 attributes
    phaseOneDuration = 20;
    targetPoints= [];
    currentTargetIndex = 0;
    movementEpsilon = 10 //for precision

    movementSpeed = 300; //speed is affected by scale for SOME reason
    wobblingSpeed = 1.5;
    minScale = 0.3;
    maxScale = 0.5;

    //timing stuff
    elapsedTime = 0;



    projectileContainer = null;
    projectiles = [];
    destroying = false;

    constructor(patternDrawLayer, player, movementSpeed, minScale =0.3, maxScale = 0.5, targetPoints=5, 
        borderDamage = 100){
        super(patternDrawLayer, player);

        //assign the parameters
        this.targetPoints = targetPoints;
        this.movementSpeed = movementSpeed;
        this.minScale = minScale;
        this.maxScale = maxScale;
        this.borderDamage = borderDamage;

        //create the container for all of the projectiles
        this.projectileContainer = new PIXI.Container();
        this.projectileContainer.x = 400;
        this.projectileContainer.y = 300;
        this.drawLayer.addChild(this.projectileContainer);
    }


    //generates n random position points all over the map except for a border of thickness 50
    generateTargetPoints(n){
        let points = [];

        for(let i = 0; i < n; i++){
            points.push( {x: Math.random() * 700 + 50, y:Math.random() * 500 + 50} );
        }

        return points;
    }


    load(){
        //create the corner projectiles
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, new Vector(-440, -340), 0, new Vector(0, 0), {x:80,y:80}, this.borderDamage));
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, new Vector(440, -340), 0, new Vector(0, 0), {x:80,y:80}, this.borderDamage));
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, new Vector(-440, 340), 0, new Vector(0, 0), {x:80,y:80}, this.borderDamage));
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, new Vector(440, 340), 0, new Vector(0, 0), {x:80,y:80}, this.borderDamage));


        //create top line of projectiles
        for(let x = 320 / 9 + 30; x< 800; x+= 320/9 + 60){
            this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, new Vector(-400 + x, -340), 0, new Vector(0, 0), {x:60, y:60}, this.borderDamage));

        } 

        //create bottom line of projectiles
        for(let x = 320 / 9 + 30; x< 800; x+= 320/9 + 60){
            this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, new Vector(-400+ x, 340), 0, new Vector(0, 0), {x:60, y:60}, this.borderDamage ));

        }

        //create left line of projectiles
        for(let y = 300 / 6 + 30; y < 600; y+=300 / 6 + 60){
            this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, new Vector(-440, -300 + y), 0, new Vector(0, 0), {x:60, y:60}, this.borderDamage ));

        }


        //create right line of projectiles
        for(let y = 300 / 6 + 30 ; y < 600; y+=300 / 6 + 60){
            this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, new Vector(440, -300 + y), 0, new Vector(0, 0), {x:60, y:60}, this.borderDamage ));
        }




    }

    update(delta, inputs){
        if (this.destroying){   // don't try to update if destroy is called.
            return
        }

        //keep track of the time that has gone by so far 
        this.elapsedTime += delta;


        //update all of the projectiles
        for(let projectile of this.projectiles){
            projectile.update(delta);
        }

        //if still in phase 0 (initial shrinking )
        if (this.currentPhase == 0){


            //shrink THE BOX
            this.projectileContainer.scale.x = Math.max(0, this.projectileContainer.scale.x - delta * 1/this.shrinkSpeed) ;
            this.projectileContainer.scale.y = Math.max(0, this.projectileContainer.scale.y - delta * 1/this.shrinkSpeed) ;
            

            //terminate the phase when it's small enough
            if (this.projectileContainer.scale.x <= this.minScale){
                //set the scale properly
                this.projectileContainer.scale.x = this.minScale;
                this.projectileContainer.scale.y = this.minScale;

                //end the phase and record the end time 
                this.currentPhase = 1;
                this.phaseZeroEndTime = this.elapsedTime;

                //generate target points for the next phase
                this.targetPoints= this.generateTargetPoints(this.targetPoints);
            }
        }

        //if it's in phase 1 (moving and wobbling)
        else if (this.currentPhase == 1){
            //wobble with a cos function
            let currentScale = this.minScale + (this.maxScale - this.minScale)/2 - (this.maxScale - this.minScale)/2 * Math.cos(this.wobblingSpeed * (this.elapsedTime - this.phaseZeroEndTime));

            this.projectileContainer.scale.x = currentScale;
            this.projectileContainer.scale.y = currentScale;


            //get the vector to the destination vector
            let currentTargetPoint = this.targetPoints[this.currentTargetIndex];
            let directionVector = new Vector(currentTargetPoint.x - this.projectileContainer.x, currentTargetPoint.y - this.projectileContainer.y);
            
            //if vector is big, normalize, if vector is small, move to next target point
            let norm = directionVector.getNorm();

            if (norm <= this.movementEpsilon){
                if (this.currentTargetIndex == this.targetPoints.length-1){
                    this.currentPhase = 2;
                } 
                else{
                    this.currentTargetIndex += 1;
                }
            }
            else if (norm != 0){
                directionVector = directionVector.normalize();
            }

            //make a movement in that direction
            this.projectileContainer.x += this.movementSpeed * directionVector.x * delta;
            this.projectileContainer.y += this.movementSpeed * directionVector.y * delta;

    


        } 


    }


    //returns a copy of this pattern
    clone(){
        return new SquarePattern(this.drawLayer, this.playerReference, this.movementSpeed, this.minScale, this.maxScale, this.targetPoints.length, this.borderDamage)
    }

    isDone(){
        // return false;
        //return this.elapsedTime > this.duration;
        return this.currentPhase === 2;
    }

    destroy(){
        //remove all generated entities
        this.destroying = true;
        for (let projectile of this.projectiles){
            projectile.destroy();
        }
        this.projectileContainer.destroy();
        delete this;
    }

}