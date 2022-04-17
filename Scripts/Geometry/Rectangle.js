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


    //assumes otherRec is also a rectangle instance
    isColliding(otherRec){
        return (this.x < (otherRec.x + otherRec.width)) &&
                ( (this.x + this.width) > otherRec.x) &&
                ( this.y < (otherRec.y + otherRec.height) ) &&
                ( (this.y + this.height) > otherRec.y ); 

    }

    //pixel perfect collision
    simulateCollision(otherRec, xDirection, yDirection){
        //otherRec is the current position of the other box
        //otherRecX is the future position of the other box on the x axis
        //otherRecY is the future position of the other box on the y axis
        let canAddX = xDirection != 0;
        let canAddY = yDirection != 0;

        while(true){
            if (canAddX){
                otherRec.x += xDirection;
                if (this.isColliding(otherRec)){
                    otherRec.x -= xDirection;
                    canAddX = false;
                }
            } 

            if (canAddY){
                otherRec.y += yDirection;
                if(this.isColliding(otherRec)){
                    otherRec.y -= yDirection;
                    canAddY = false;
                }
            }

            if (!canAddX && !canAddY){
                break;
            }

        }

        return otherRec;




    }

    //generate a graphics object for displaying this shape
    getGraphics(hue){
        const graphics = new PIXI.Graphics();

        graphics.beginFill(hue);
        graphics.drawRect(this.x, this.y, this.width, this.height);
        graphics.endFill();

        return graphics;
    }

}