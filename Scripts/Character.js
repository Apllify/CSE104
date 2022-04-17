"use strict";
class Character{
    speed = 400;
    health = 100;

    xVelocity = 0;
    yVelocity = 0;

    previousX = 0;
    previousY = 0;

    x = 0;
    y = 0;

    maxHealth = 100; 
    health = 100;
    name = "BX";

    spriteWidth = 32;
    spriteHeight = 32;

    collisionWidth = 32;
    collisionHeight = 32;

    sprite = null;
    hit = true;
    destroying = false;

    constructor(drawLayers, startingCoords = {x:0, y:0}, ){
        //instantiate the player sprite
        const shieldTexture = PIXI.Texture.from("Sprites/Shield.png");
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

        this.healthBar = new HealthBar(drawLayers.foregroundLayer, this);
    }

    getOldHitboxRectangle(){
        return new Rectangle(this.previousX - this.collisionWidth / 2, this.previousY - this.collisionHeight / 2,
            this.collisionWidth, this.collisionHeight);
    }

    getHitboxRectangle(){
        return new Rectangle(this.x - this.collisionWidth / 2, this.y - this.collisionHeight / 2,
            this.collisionWidth, this.collisionHeight);
    }

    setHitboxRectangle(rec){
        this.x = rec.x + this.collisionWidth / 2;
        this.y = rec.y + this.collisionHeight / 2;
        this.updateSpritePosition();
    }

    update(delta, inputs){
        if (this.destroying){
            return;
        }

        //keep track of the old player position
        this.previousX = this.x;
        this.previousY = this.y;

        //update the player velocity
        this.xVelocity = 0;
        this.yVelocity = 0;

        // this.health = Math.max(0, this.health - 0.2);  // line to test health bar at different health values.
        this.healthBar.update();
        if (inputs.left.isDown || inputs.leftAlt.isDown){
            this.xVelocity -= this.speed;
        }

        if (inputs.right.isDown){
            this.xVelocity += this.speed;
        }
    
        if (inputs.up.isDown || inputs.upAlt.isDown){
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
        this.destroying = true;
        this.sprite.destroy();
        this.healthBar.destroy();
        delete this;
    }
}