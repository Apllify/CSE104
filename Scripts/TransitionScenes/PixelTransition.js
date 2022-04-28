"use strict";

//cool pixel art fade in and out effect
class PixelTransition{
    
    state = 0; //1 is fading in, 2 is fading out, 3 is done with everything
    currentDetectionRadius = 500; //starts off as encompassing the entire screen

    rectangleSize = 10;
    transitionColor = 0x000000;

    allPoints= [];
    pointGraphics=  [];

    graphics = null;

    fadeInTime = 3;
    fadeOutTime = 3;

    fadeInSpeed = 0;
    fadeOutSpeed = 0;
    
    constructor(fadeInTime = 1, fadeOutTime = 1, transitionColor = 0x000000){
        this.fadeInTime = fadeInTime;
        this.fadeOutTime = fadeOutTime;

        this.transitionColor = transitionColor;

        //set the speeds such that they reach 500 in the alloted time
        this.fadeInSpeed = 500 / this.fadeInTime;
        this.fadeOutSpeed = 500/this.fadeOutTime;



        //initialize the list of all center coordinates
        let x = (this.rectangleSize  /2 );
        while (x<800){

            let y = (this.rectangleSize / 2);

            while( y < 600){

                //add it to the points list
                this.allPoints.push([x, y]);

                //increment y 
                y += this.rectangleSize;
            }

            //increment x
            x += this.rectangleSize;
        }

        //initialize the list of graphics objects to be null
        for (let i = 0; i < this.allPoints.length ; i++){
            this.pointGraphics.push(null);
        }


    }



    startFadeIn(){
        this.state = 1;
        this.donePoints = [];
    }

    isFadeInDone(){
        return (this.state >= 2);
    }

    startFadeOut(){
        this.state = 2;
        this.donePoints = [];

    }

    isFadeOutDone(){
        return (this.state === 3);
    }

    update(delta, inputs){
        //update depending on state
        if (this.state === 1){

            //shrink the detection radius
            this.currentDetectionRadius -= this.fadeInSpeed * delta;

            //iterate over the list of all points and do the ones outside of radius that haven't been done yet 
            for (let i = 0; i < this.allPoints.length ; i++){
                //check that it hasn't been done already
                if (this.pointGraphics[i] === null){

                    let coords = this.allPoints[i];
                    let pointDistance = Math.sqrt( Math.pow(coords[0] - 400, 2) + Math.pow(coords[1] - 300, 2));

                    //check that it is outside of detection range
                    if (pointDistance > this.currentDetectionRadius){

                        //create a graphics to be put at that position
                        let graphics = new PIXI.Graphics();
                        graphics.beginFill(this.transitionColor);
                        graphics.drawRect(0, 0,this.rectangleSize, this.rectangleSize);
                        graphics.x = coords[0] - this.rectangleSize/ 2;
                        graphics.y = coords[1] - this.rectangleSize / 2;
                        graphics.endFill();

                        //add it to the list at the proper index
                        this.pointGraphics[i] = graphics;
                        drawLayers.transitionForegroundLayer.addChild(graphics);


                    }

                }
            }

            //done when detection radius goes below zero
            if (this.currentDetectionRadius <= 0){
                this.state = 2;
            }

        }
        else if (this.state === 2){
            //expand the detection radius 
            this.currentDetectionRadius += this.fadeOutSpeed * delta;

            //iterate over the list of all points to find the ones that are now inside of the radius
            for (let i = 0; i < this.allPoints.length ; i++){
                //check that it hasn't been destroyed already
                if (this.pointGraphics[i] !== null){


                    let coords = this.allPoints[i];
                    let pointDistance = Math.sqrt( Math.pow(coords[0] - 400, 2) + Math.pow(coords[1] - 300, 2));

                    //check that it is outside of detection range
                    if (pointDistance < this.currentDetectionRadius){

                        //create a graphics to be put at that position
                        this.pointGraphics[i].clear();
                        this.pointGraphics[i] = null;


                    }

                }
            }

            
            //done when detection radius goes beyond the screen
            if (this.currentDetectionRadius > 500){
                this.state = 3;
            }
        }

    }

    destroy(){
        this.state = 0;

        //destroy every single graphics object
        for(let graphic of this.pointGraphics){
            if (graphic !== null ){
                graphic.destroy();

            }
        }
    }

}