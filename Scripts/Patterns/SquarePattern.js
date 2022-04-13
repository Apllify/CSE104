"use strict";
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
        this.projectileContainer.x = 400;
        this.projectileContainer.y = 300;
        this.drawLayer.addChild(this.projectileContainer);
    }

    load(){
        //there are 

        //create the corner projectiles
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x:-440, y:-340}, 0, {x:0, y:0}, {x:80,y:80}));
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x:440, y:-340}, 0, {x:0, y:0}, {x:80,y:80}));
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x:-440, y:340}, 0, {x:0, y:0}, {x:80,y:80}));
        this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x:440, y:340}, 0, {x:0, y:0}, {x:80,y:80}));

        let currentProjectile = null;

        //create top line of projectiles
        for(let x = 440/7; x< 800; x+= 440/7 + 60){
            this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x:-400 + x, y:-240}, 0, {x:0,y:0}, {x:60, y:60} ));

        } 

        //create bottom line of projectiles
        for(let x =440/7;x<800;x+=440/7 + 60){
            this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x:-400+ x, y:340}, 0, {x:0,y:0}, {x:60, y:60} ));

        }

        //create left line of projectiles
        for(let y = 50; y < 600; y+=50 + 60){
            this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x: -440, y:-300+y}, 0, {x:0,y:0}, {x:60, y:60} ));

        }


        //create right line of projectiles
        for(let y = 50; y < 600; y+=50 + 60){
            this.projectiles.push(new Projectile(this.projectileContainer, this.playerReference, {x: 440, y:-300 + y}, 0, {x:0,y:0}, {x:60, y:60} ));
        }




    }

    update(delta, inputs){
        this.elapsedTime += delta;


        //update all of the projectiles
        for(let projectile of this.projectiles){
            projectile.update(delta);
        }

        //shrink THE BOX
        this.projectileContainer.scale.x = Math.max(0, this.projectileContainer.scale.x) ;
        this.projectileContainer.scale.x = Math.max(0, this.projectileContainer.scale.y) ;

        console.log(delta);

    }

    isDone(){
        return false;
        //return this.elapsedTime > this.duration;
    }

    destroy(){

    }

}