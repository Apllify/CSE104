class SquarePattern extends Pattern{

    currentPhase = 0;
    //phase 0 : zoom in around the player 
    //phase 1 : move around randomly while stretching 

    elapsedTime = 0;
    duration = 3;
    movementSpeed = 0;

    minSize = 0;
    maxSize = 0;

    projectileContainer = null;
    projectiles = [];


    constructor(patternDrawLayer, player, duration, movementSpeed, minSize, maxSize){
        super(patternDrawLayer, player);

        //create the container for all of the projectiles
        this.projectileContainer = new PIXI.Container();
        this.projectileContainer.x = 0;
        this.projectileContainer.y = 0;
        this.drawLayer.addChild(this.projectileContainer);
    }

    load(){
        //create the corner projectiles
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x:-40, y:-40}, 0, {x:0, y:0}, {x:80,y:80}));
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x:840, y:-40}, 0, {x:0, y:0}, {x:80,y:80}));
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x:-40, y:640}, 0, {x:0, y:0}, {x:80,y:80}));
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x:840, y:640}, 0, {x:0, y:0}, {x:80,y:80}));

        let currentProjectile = null;

        //create top line of projectiles
        for(let i = 440/7; i< 800; i+= 440/7){
             currentProjectile = new Projectile(this.projectileContainer, this.playerReference, {x: i, y:-40}, 0, {x:0,y:0}, {x:60, y:60} );
            this.projectiles.push(currentProjectile);

        } 

        //create bottom line of projectiles
        for(let i =440/7;i<800;i+=440/7){
             currentProjectile = new Projectile(this.projectileContainer, this.playerReference, {x: i, y:640}, 0, {x:0,y:0}, {x:60, y:60} );
            this.projectiles.push(currentProjectile);

        }

        //create left line of projectiles
        for(let j = 50; j < 600; j+=50){
             currentProjectile = new Projectile(this.projectileContainer, this.playerReference, {x: -40, y:j}, 0, {x:0,y:0}, {x:60, y:60} );
            this.projectiles.push(currentProjectile);

        }


        //create right line of projectiles
        for(let j = 50; j < 600; j+=50){
            currentProjectile = new Projectile(this.drawLayer, this.playerReference, {x: 840, y:j}, 0, {x:0,y:0}, {x:60, y:60} );
            this.projectiles.push(currentProjectile);
        }



    }

    update(delta, inputs){
        this.elapsedTime += delta;

        //update all of the projectiles
        for(let projectile of this.projectiles){
            projectile.update(delta);
        }

    }

    isDone(){
        return false;
        //return this.elapsedTime > this.duration;
    }

    destroy(){

    }

}