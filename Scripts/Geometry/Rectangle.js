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

    //generate a graphics object for displaying this shape
    getGraphics(hue){
        const graphics = new PIXI.Graphics();

        graphics.beginFill(hue);
        graphics.drawRect(this.x, this.y, this.width, this.height);
        graphics.endFill();

        return graphics;
    }

}