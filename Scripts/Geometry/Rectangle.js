'use strict';
class Rectangle{

    //the position of the top left corner of the rectangle
    x = 0;
    y = 0;

    width = 0;
    height = 0;

    constructor(x, y, width, height){
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;
    }

    equals(otherRec){
        return (this.x === otherRec.x) && (this.y === otherRec.y) && (this.width === otherRec.width) && (this.height === otherRec.height);
    }


    //assumes otherRec is also a rectangle instance
    isColliding(otherRec){
        return (this.x < (otherRec.x + otherRec.width)) &&
                ( (this.x + this.width) > otherRec.x) &&
                ( this.y < (otherRec.y + otherRec.height) ) &&
                ( (this.y + this.height) > otherRec.y ); 

    }

    //pixel perfect collision
    simulateCollision(oldRec, newRec){
        //otherRec is the old position of the other box
        //newRec is the current position of the other box (should collide with us)

        //only proceed if there is a collision with the new rectangle
        if (!this.isColliding(newRec)){
            return newRec;
        }

        const xDirection = Math.sign(newRec.x - oldRec.x);
        const yDirection = Math.sign(newRec.y - oldRec.y);

        const xBound = Math.floor(Math.abs(newRec.x - oldRec.x));
        const yBound = Math.floor(Math.abs(newRec.y - oldRec.y));

        let canAddX = xDirection != 0;
        let canAddY = yDirection != 0;

        let xIncrement = 0;
        let yIncrement = 0;


        while(true){
            
            if (xIncrement >= xBound){
                canAddX = false;
            } 
            if (yIncrement >= yBound){
                canAddY = false;
            }

            if (canAddX){

                xIncrement += 1;
                oldRec.x += xDirection;

                if (this.isColliding(oldRec)){
                    oldRec.x -= xDirection;
                    canAddX = false;
                }
            } 

            if (canAddY){

                yIncrement += 1;
                oldRec.y += yDirection;

                if(this.isColliding(oldRec)){
                    oldRec.y -= yDirection;
                    canAddY = false;
                }
            }

            if (!canAddX && !canAddY){
                break;
            }

        }

        return oldRec;




    }

    //generate a graphics object for displaying this shape
    getGraphics(hue, alpha=1){
        const graphics = new PIXI.Graphics();

        graphics.beginFill(hue);
        graphics.drawRect(this.x, this.y, this.width, this.height);
        graphics.endFill();
        graphics.alpha = alpha;
        return graphics;
    }

}