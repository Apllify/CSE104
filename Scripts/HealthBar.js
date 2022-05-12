"use strict";


class HealthBar{    // Health Bar class whose instance can be attached to a character. 


    initialWidth = 120;
    ratio = 1;
    width = 120;
    hex = 0x00ff00;
    destroying = false;

    healthBarTextStyle = null;



    constructor(drawLayer, player, right=false){    // we take the drawing layer and calling character as arguments.

        //set up the text style for the player name
        this.healthBarTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 36,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });


        //set the instance variables
        this.right = right;
        this.drawLayer = drawLayer;
        this.playerReference = player;
        this.playerName = this.playerReference.name;
        this.nameTag = new TextDisplay(drawLayer, this.playerName, {x:10, y:10}, this.healthBarTextStyle);
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(this.hex);




        if (this.right){      // if the healthbar is to be drawn on the right, we make some adjustments.
            this.nameWidth = this.nameTag.getDimensions().width;
            this.nameTag.centerHorizontallyAt(app.stage.width - 3 - this.nameWidth / 2);
            this.graphicsx = app.stage.width - 5 - this.initialWidth - this.nameWidth;
            this.graphics.drawRect(this.graphicsx, 10, this.initialWidth, 30);
        }
        else{
            this.graphics.drawRect(12 + this.nameTag.getDimensions().width, 10, this.width, 30);
        }
        drawLayer.addChild(this.graphics);
        
    }

    update(){
        // update the health bar width and color based on player health. 
        if (this.destroying){
            return
        }

        this.ratio = this.playerReference.health / this.playerReference.maxHealth;
        this.greenvalue = 255 * this.ratio;
        this.redvalue = 255 * (1 - this.ratio);
        this.graphics.clear(); 
        this.hex = '#' + parseInt(this.redvalue).toString(16) + parseInt(this.greenvalue).toString(16) + '00';

        //ensure the health bar doesn't go in the negative
        this.width = Math.max(this.initialWidth * this.ratio, 0);



        // beginFill doesn't accept hex-strings for some reason
        this.hex = Number(`0x${this.hex.substring(1)}`);
        this.graphics.beginFill(this.hex);
        if (this.right){    // Since the healthbar is on the right it must appear to decrease to the right.
            this.graphics.drawRect(this.graphicsx + this.initialWidth * (1 - this.ratio), 10, this.width, 30);
        }
        else{
            this.graphics.drawRect(12 + this.nameTag.getDimensions().width, 10, this.width, 30);
        }

        if (window.localStorage.getItem('ProfMode') == 0){
            this.nameTag.setTint(0xFFFFFF);
        }

        else{
            this.nameTag.setTint(0x0000FF);
        }
        
    }

    destroy(){
        this.destroying = true;
        this.drawLayer.removeChild(this.graphics);
        this.drawLayer.removeChild(this.nameTag);
        this.nameTag.destroy();
        delete this;
    }
}