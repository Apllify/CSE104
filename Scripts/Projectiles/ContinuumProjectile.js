'use strict';
class ContinuumProjectile extends Projectile{

    lifespan = 5;
    elapsedTime = 0;


    constructor(drawLayer, player, coordinates, projectileSpeed, directionVector, lifespan = 5, dimensions = {x:16, y:16}, dps = 30){
        super(drawLayer, player, coordinates, projectileSpeed, directionVector, dimensions, dps);

        this.lifespan = lifespan;
    }

    update(delta){
        if (this.destroying){
            return
        }
        super.update(delta);

        //add a screen wrap functionnality if the border is reached
        if (this.x < 0){
            this.x += 800;
        }
        else if (this.x > 800){
            this.x -= 800;
        }

        if (this.y < 0){
            this.y += 600;
        }
        else if (this.y > 600){
            this.y -= 600;
        }

        //also keep track of the elapsed time for the lifespan
        this.elapsedTime += delta;

        //if (this.elapsedTime > this.lifespan){
            //this.destroy();
      //  } 
    }


}