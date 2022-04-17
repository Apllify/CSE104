"use strict";
class PacmanPattern extends Pattern{

    elapsedTime = 0;

    duration = 10;

    //pattern attributes
    attackCooldown = 5;
    currentAttackCooldown = 5;
    shotSpeed = 400;


    //the attack telegraphs that happen before the attacks
    telegraphs = [];
    //the projectiles that are spawned after the telegraphs
    projectiles = [];

    destroying = false;


    constructor(patternDrawLayer, player, patternDuration, attackCooldown, shotSpeed){
        //calling superclass constructor
        super(patternDrawLayer, player);

        //assing the constructor parameters
        this.duration = patternDuration;
        this.attackCooldown = attackCooldown;
        this.currentAttackCooldown = attackCooldown;
        this.shotSpeed = shotSpeed;
    }

    update(delta, inputs){
        if (this.destroying){
            return;
        }
        this.elapsedTime += delta;

        this.currentAttackCooldown -= delta;

        //only update if the pattern is still ongoing 
        if (this.elapsedTime > this.duration){
            return ;
        }

        //spawn a telegraph every now and then
        if (this.currentAttackCooldown <= 0){
            this.currentAttackCooldown = this.attackCooldown;

            //create a telegraph next to the player 
            const xOffset = Math.random() * 200 - 100;
            const yOffset = Math.random() * 200 - 100;

            this.telegraphs.push(new Telegraph(this.drawLayer, {x : this.playerReference.x + xOffset, y : this.playerReference.y + yOffset}, 2));


        }

        //update the telegraphs and projectiles
        for(let telegraph of this.telegraphs){
                telegraph.update(delta);
        }
    

        for(let projectile of this.projectiles){
            projectile.update(delta);
        }


        //check for telegraphs that are done and replace them with projectiles
        for(let i = 0; i < this.telegraphs.length; i++){
            if (this.telegraphs[i].isDone()){
                //get direction vector to the player
                const directionVector = new Vector(this.playerReference.x - this.telegraphs[i].x, this.playerReference.y - this.telegraphs[i].y);
                const positionVector = new Vector(this.telegraphs[i].x, this.telegraphs[i].y);
    
                this.projectiles.push(new Projectile(this.drawLayer, this.playerReference, positionVector, this.shotSpeed, directionVector, undefined, 100));
    
                //destroy the telegraph entity and remove it from the list
                this.telegraphs[i].destroy();
                this.telegraphs.splice(i, 1);
                i -= 1;
                
            }

        }





    }

    isDone(){
        return (this.elapsedTime >= this.duration);
    }


    //remove every instanced entity
    destroy(){
        this.destroying = true;
        for(let telegraph of this.telegraphs){  
            telegraph.destroy();
        }

        for (let projectile of this.projectiles){
            if (projectile != null){
                projectile.destroy();
            }
        }
    }
}