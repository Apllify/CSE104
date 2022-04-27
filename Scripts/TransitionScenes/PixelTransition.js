"use strict";

//cool pixel art fade in and out effect
class PixelTransition{
    
    state = 0; //1 is fading in, 2 is fading out
    currentDetectionRadius = 500; //starts off as encompassing the entire screen

    rectangleSize = 10;

    allPoints= [];
    donePoints=  [];

    graphics = null;

    fadeInTime = 3;
    fadeOutTime = 3;

    fadeInSpeed = 0;
    fadeOutSpeed = 0;
    
    constructor(fadeInTime = 3, fadeOutTime = 3){
        this.fadeInTime = fadeInTime;
        this.fadeOutTime = fadeOutTime;

        //set the speeds such that they reach 500 in the alloted time
        this.fadeInSpeed = 500 / this.fadeInTime;
        this.fadeOutSpeed = 500/this.fadeOutTime;

        //create all of the target points (centers of all 10 x 10 rectangles on screen)
        for (let x = this.rectangleSize / 2; x+= this.rectangleSize; x < 800){
            for (let y = this.rectangleSize / 2; y+= this.rectangleSize; y<600){
                this.allPoints.push([x, y]);
            }
        } 

    }

    load(){
        this.graphics = new PIXI.Graphics()
        drawLayers.foregroundLayer.addChild(this.graphics);


    }

    startFadeIn(){
        this.state = 1;
        this.donePoints = [];
    }

    startFadeOut(){
        this.state = 2;
        this.donePoints = [];
    }

    update(delta, inputs){
        //update depending on state
        if (this.state === 1){
            //start filling the graphics
            this.graphics.beginFill(0xDE3249);

            //shrink the detection radius
            this.currentDetectionRadius -= this.fadeInSpeed * delta;

            //iterate over the list of all points and do the ones outside of radius that haven't been done yet 
            for (let point of this.allPoints){
                //check that it hasn't been done already
                if (!this.donePoints.includes(point)){

                    let pointDistance = Math.sqrt( Math.pow(point[0] - 400, 2) + Math.pow(point[1] - 300, 2));

                    //check that it is outside of detection range
                    if (pointDistance > this.currentDetectionRadius){
                        this.donePoints.push(point);

                        //draw a rectangle at that position
                        this.graphics.drawRect(point[0] - this.rectangleSize / 2, point[1] - this.rectangleSize / 2,
                            this.rectangleSize, this.rectangleSize);
                    }

                }
            }

            this.graphics.endFill();
        }
        else if (this.state === 2){
            //expand the detection radius 
            this.currentDetectionRadius += this.fadeOutSpeed * delta;
        }

    }

    destroy(){
        this.state = 0;
        this.graphics.destroy();
    }

}