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

    drawLayer = null;


    isPaused=  false;
    

    constructor(startingCoords = {x:0, y:0}, drawLayer = null ){
        //instantiate the player sprite
        const shieldTexture = PIXI.Texture.from("Sprites/Shield.png");
        this.sprite = new PIXI.Sprite(shieldTexture);

        //set the starting position
        this.x = startingCoords.x;
        this.y = startingCoords.y;

        this.updateSpritePosition();

        //display the sprite such that (x, y) represent its center
        this.updateSpritePosition();


        //load the player name from window memory if possible 
        this.name = window.localStorage.getItem("username");

        //save the draw layers
        this.drawLayer = drawLayer;

        //add the sprite to the scene
        if (this.drawLayer == null){
            drawLayers.activeLayer.addChild(this.sprite);
        }
        else{
            this.drawLayer.addChild(this.sprite);
        }

        this.healthBar = new HealthBar(drawLayers.foregroundLayer, this);
    }

    pause(){
        this.isPaused = true;
    }

    unpause(){
        this.isPaused = false;
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
        
        //don't take inputs if the player is paused
        if (!this.isPaused){
            if (inputs.left.isDown || inputs.leftAlt.isDown){
                this.xVelocity -= 1;
            }
    
            if (inputs.right.isDown){
                this.xVelocity += 1;
            }
        
            if (inputs.up.isDown || inputs.upAlt.isDown){
                this.yVelocity -= 1;
            }
        
            if (inputs.down.isDown){
                this.yVelocity += 1;
            }
        }


        let velocityVect = new Vector(this.xVelocity, this.yVelocity);
        velocityVect = velocityVect.normalize().rescale(this.speed);

        this.x += velocityVect.x * delta;
        this.y += velocityVect.y * delta;

        //update the sprite's position on screen
        this.updateSpritePosition();
    }

    refillHealth(){
        this.health = this.maxHealth;
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