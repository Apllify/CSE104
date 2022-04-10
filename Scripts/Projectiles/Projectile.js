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

    //the default projectile speed
    speed = 400;

    //the default direction
    direction = {x : 1, y:0};

    //every projectile needs an explicit reference to the player 
    playerReference = null;


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
        this.displayGraphic.drawRect(this.x - this.width/2, this.y -this.height/2, this.width, this.height);
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

        
        const newX = v.x / norm;
        const newY = v.y / norm;

        return {x : newX, y:newY};
    }


    //checks for a box collision between b1 and b2
    checkBoxCollision(b1, b2){
        return ( b1.x < (b2.x +b2.width) ) &&
            ( (b1.x + b1.width) > b2.x ) &&
            ( b1.y < (b2.y + b2.height) ) &&
            ( (b1.y + b1.height) > b2.y  );

    }

    isOutOfBounds(){
        return (this.x < 0) || (this.x > 800) || (this.y < 0) || (this.y >600);
    }

    update(delta){
        //move the projectile by the proper amount in both direction
        this.x += this.direction.x * this.speed * delta;
        this.y += this.direction.y * this.speed * delta;

        this.displayGraphic.x = this.x;
        this.displayGraphic.y = this.y;




        //update collision box's position to check for collision
        this.hitbox.x = this.x - this.width / 2;
        this.hitbox.y = this.y - this.height / 2;

        const playerHitbox = {x:this.playerReference.x - this.playerReference.collisionWidth / 2,
                            y : this.playerReference.y - this.playerReference.collisionHeight / 2,
                            width : this.playerReference.collisionWidth,
                            height : this.playerReference.collisionHeight };

        const isCollision = this.checkBoxCollision(this.hitbox, playerHitbox);

        if (isCollision){
            console.log("COLLISION");
        }

    }

    destroy(){

    }


}