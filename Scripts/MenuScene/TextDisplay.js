"use strict";
class TextDisplay{

    textEntity = null;

    constructor( drawLayer, textContent, position, textStyle = null, alpha=1){
        // alpha value is 1 by default.
        //use the given textstyle if possible
        if (textStyle != null){
            this.textEntity = new PIXI.Text(textContent, textStyle);
        }
        else{
            this.textEntity = new PIXI.Text(textContent);
        }


        this.textEntity.x = position.x;
        this.textEntity.y = position.y;
        this.textEntity.alpha = alpha;

        drawLayer.addChild(this.textEntity);

    }

    //centers the text horizontally around a given x position
    centerHorizontallyAt(xPosition){
        //get the dimension rect 
        const dimensionRect = this.textEntity.getLocalBounds();
    
        //get half of the width
        const halfWidth = dimensionRect.width / 2;
        this.textEntity.x = xPosition - halfWidth;
    }

    //centers the text vertically around a given position
    centerVerticallyAt(yPosition){
        //get the dimension rect
        const dimensionRect = this.textEntity.getLocalBounds();

        //get half of the height 
        const halfHeight = dimensionRect.height / 2;
        this.textEntity.y = yPosition - halfHeight;
    }

    getCenterPosition(){
        const dimensions = this.getDimensions();

        return {x : this.textEntity.x + dimensions.width / 2, y : this.textEntity.y + dimensions.height/2};
    }

    getDimensions(){
        return {width : this.textEntity.getLocalBounds().width, height :this.textEntity.getLocalBounds().height};
    }

    destroy(){
        this.textEntity.destroy();
    }


}