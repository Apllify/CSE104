class ProjectileBombPattern extends Pattern{

    x = 0;
    y = 0;

    destroying = false;

    projectileCount = 7;
    projectileSpeed = 0;
    lifeSpan = 10;
    dps = 30;

    elapsedTime = 0;

    projectilesList = [];

    constructor(patternDrawLayer, player, coordinates, projectileCount, projectileSpeed, lifeSpan, dps= 30){
        super(patternDrawLayer, player);


        this.x = coordinates.x;
        this.y = coordinates.y;

        this.projectileCount= projectileCount;
        this.projectileSpeed = projectileSpeed;
        this.lifeSpan = lifeSpan;
        this.dps = dps;
    }

    activate(){
        //instantiate all of the projectiles
        for (let angle = 0; angle <= 2 * Math.PI; angle += 2 * Math.PI / this.projectileCount ){
            let x_direction = Math.cos(angle);
            let y_direction = Math.sin(angle);

            let directionVector = new Vector(x_direction, y_direction);

            this.projectilesList.push(new ContinuumProjectile(this.drawLayer, this.playerReference,
                {x: this.x, y:this.y}, this.projectileSpeed, directionVector, this.lifeSpan, undefined, this.dps));
        }
    }

    update(delta, inputs){

        //increment internal timer
        this.elapsedTime += delta;

        if (this.destroying){
            return;
        }

        for (let projectile of this.projectilesList){
            projectile.update(delta);
        }
    }

    isDone(){
        return (this.elapsedTime >= this.lifeSpan);
    }

    destroy(){

        this.destroying = true;

        for (let projectile of this.projectilesList){
            if (projectile != null){
                projectile.destroy();
            }
            
        }
    }
}