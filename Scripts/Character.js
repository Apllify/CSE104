class Character{
    speed = 7;
    health = 100;

    xVelocity = 0;
    yVelocity = 0;

    x = 0;
    y = 0;

    sprite = null;

    constructor(drawLayers){
        //instantiate the player sprite
        const shieldTexture = PIXI.Texture.from("../Sprites/Shield.png");
        this.sprite = new PIXI.Sprite(shieldTexture);

        this.sprite.x = this.x;
        this.sprite.y = this.y;

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
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    destroy(){
        //remove all of the sprites associated with this entity
        this.sprite.destroy();
    }
}