"use strict";
class TextDisplay{

    textEntity = null;
    destroyed = false;

    constructor( drawLayer, textContent, position, textStyle = undefined, alpha=1){
        // alpha value is 1 by default.
        //use the given textstyle if possible
        this.textEntity = new PIXI.Text(textContent, textStyle);


        this.textEntity.x = position.x;
        this.textEntity.y = position.y;
        this.textEntity.alpha = alpha;

        this.textEntity.updateText();
        this.textEntity.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


        drawLayer.addChild(this.textEntity);

    }

    //change the text content of this display
    setText(newText){
        this.textEntity.text = newText;
    }

    setTextStyle(textStyle){
        this.textEntity.style = textStyle;
    }

    update(delta){
        return;
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

        //return {x : this.textEntity.x + dimensions.width / 2, y : this.textEntity.y + dimensions.height/2};
        return new Vector(this.textEntity.x + dimensions.width / 2, this.textEntity.y + dimensions.height/2);
    }

    getDimensions(){
        return {width : this.textEntity.getLocalBounds().width, height :this.textEntity.getLocalBounds().height};
    }

    destroy(){
        if (!this.destroyed){
            this.textEntity.destroy();
            this.destroyed = true;
        }
    }


}