class Character{
    speed = 7;
    health = 100;

    xVelocity = 0;
    yVelocity = 0;

    x = 0;
    y = 0;

    spriteWidth = 32;
    spriteHeight = 32;

    collisionWidth = 32;
    collisionHeight = 32;

    sprite = null;

    constructor(drawLayers, startingCoords = {x:0, y:0}){
        //instantiate the player sprite
        const shieldTexture = PIXI.Texture.from("../Sprites/Shield.png");
        this.sprite = new PIXI.Sprite(shieldTexture);

        //set the starting position
        this.x = startingCoords.x;
        this.y = startingCoords.y;

        this.updateSpritePosition();

        //display the sprite such that (x, y) represent its center
        this.updateSpritePosition();

        this.sprite.scale.x = 2.0;
        this.sprite.scale.y = 2.0;

        //add the sprite to the scene
        drawLayers.activeLayer.addChild(this.sprite);
    }


    update(delta, inputs){
        //update the player velocity
        this.xVelocity = 0;
        this.yVelocity = 0;
        

        if (inputs.left.isDown){
            this.xVelocity -= this.speed;
        }

        if (inputs.right.isDown){
            this.xVelocity += this.speed;
        }
    
        if (inputs.up.isDown){
            this.yVelocity -= this.speed;
        }
    
        if (inputs.down.isDown){
            this.yVelocity += this.speed;
        }


        this.x += this.xVelocity * delta;
        this.y += this.yVelocity * delta;

        //update the sprite's position on screen
        this.updateSpritePosition();
    }

    updateSpritePosition(){
        this.sprite.x = this.x - this.spriteWidth /2;
        this.sprite.y = this.y - this.spriteHeight/2;
    }

    destroy(){
        //remove all of the sprites associated with this entity
        this.sprite.destroy();
    }
}