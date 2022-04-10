"use strict";
class HealthBar{    // Health Bar class whose instance can be attached to a character. 
    initialWidth = 120;
    ratio = 1;
    width = 120;
    hex = 0x00ff00;
    constructor(drawLayer, player){    // we take the drawing layer and calling character as arguments.
        this.playerReference = player;
        this.nameTag = new TextDisplay(drawLayer, player.name, {x:10, y:10}); 
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(this.hex);
        this.graphics.drawRect(12 + this.nameTag.textEntity.width, 10, this.width, 30);
        drawLayer.addChild(this.graphics);
        
    }

    update(){
        // update the health bar width and color based on player health. 
        this.ratio = this.playerReference.health / this.playerReference.maxHealth;
        this.greenvalue = 255 * this.ratio;
        this.redvalue = 255 * (1 - this.ratio);
        this.width = this.initialWidth * this.ratio;
        this.graphics.clear(); 
        this.hex = '#' + parseInt(this.redvalue).toString(16) + parseInt(this.greenvalue).toString(16) + '00';
        // beginFill doesn't accept hex-strings for some reason
        this.hex = Number(`0x${this.hex.substring(1)}`);
        this.graphics.beginFill(this.hex);
        this.graphics.drawRect(12 + this.nameTag.textEntity.width, 10, this.width, 30);
    }


}