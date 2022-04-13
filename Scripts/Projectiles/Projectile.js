"use strict";
class Projectile{

    //the position of the center of the projectile
    x = 0;
    y = 0;

    //the default projectile hitbox
    width = 16;
    height = 16;
    hitbox = {x : -this.width / 2, y:-this.height/2, width:this.width, height:this.height };

    //the display graphics
    displayGraphic = null;

    //some projectile attributes
    speed = 400;
    dps = 30; 

    //the default direction
    direction = {x : 1, y:0};

    //every projectile needs an explicit reference to the player 
    playerReference = null;
    destroying = false;


    constructor(drawLayer, player, coordinates, projectileSpeed, directionVector, dimensions = {x:16, y:16} ){
        //set the main projectile caracteristics
        this.playerReference = player;

        this.x = coordinates.x;
        this.y = coordinates.y;


        this.speed = projectileSpeed;



        //set the dimensions if necessary 
        this.width = dimensions.x;
        this.height = dimensions.y;
        this.hitbox = {x :-this.width / 2, y:-this.height/2, width : this.width, height:this.height};



        //automatically normalizes the direction vector just in case
        this.direction = this.normalizeVector(directionVector);

        //create and add display graphics 
        this.displayGraphic = new PIXI.Graphics();
        this.displayGraphic.beginFill(0xFFFFFF);
        this.displayGraphic.drawRect(this.x + this.hitbox.x, this.y + this.hitbox.y, this.hitbox.width, this.hitbox.height);
        this.displayGraphic.endFill();



        drawLayer.addChild(this.displayGraphic);

        //rotate the graphics to match the direction
        this.displayGraphic.pivot.x = this.x;
        this.displayGraphic.pivot.y = this.y;
        this.displayGraphic.rotation = Math.acos(this.direction.x);
    }

    normalizeVector(v){
        //reduces the vector such that the total norm is 1
        const norm = Math.sqrt(v.x*v.x + v.y *v.y);

        if (norm != 0){
            const newX = v.x / norm;
            const newY = v.y / norm;
        }
        else{
            return {x:0, y:0};
        }


        return {x : newX, y:newY};
    }


    //checks for a box collision between b1 and b2
    checkBoxCollision(b1, b2){
        return ( b1.x < (b2.x + b2.width) ) &&
            ( (b1.x + b1.width) > b2.x ) &&
            ( b1.y < (b2.y + b2.height) ) &&
            ( (b1.y + b1.height) > b2.y  );

    }

    isOutOfBounds(){
        //use bounds rectangle to get absolute coordinates
        const boundsRectangle = this.displayGraphic.getBounds();

        //check whether hitbox collides with game extremities
        return (boundsRectangle.x < 0) ||(boundsRectangle.y < 0) ||
                (boundsRectangle.y + boundsRectangle.height > 600 ) || (boundsRectangle.x + boundsRectangle.width > 800);

    }

    update(delta){
        if (this.destroying){   // don't try to update if destroy is called.
            return 
        }
        //move the projectile by the proper amount in both direction
        this.x += this.direction.x * this.speed * delta;
        this.y += this.direction.y * this.speed * delta;

        this.displayGraphic.x = this.x;
        this.displayGraphic.y = this.y;





        //use bounds rectangle with absolute coordinates to check for collision
        const boundsRectangle = this.displayGraphic.getBounds();
        
        //assumes the player is already in absolute coordinates
        const playerHitbox = {x:this.playerReference.x - this.playerReference.collisionWidth / 2,
                            y : this.playerReference.y - this.playerReference.collisionHeight / 2,
                            width : this.playerReference.collisionWidth,
                            height : this.playerReference.collisionHeight };

        const isCollision = this.checkBoxCollision(boundsRectangle, playerHitbox);

        //for now, lower the player health by a little bit when colliding
        if (isCollision){
            this.playerReference.health -= this.dps * delta;
        }

    }

    destroy(){
        this.destroying = true;
        this.displayGraphic.destroy();
        delete this; 
    }


}