class Telegraph {

    drawLayer = null;

    x = 0;
    y = 0;

    size = 50;

    hex = 0x3440EB;

    fadeDuration = 0;
    fadeSpeed = 0;

    graphicsDevice = null;


    constructor(drawLayer, coords, fadeDuration){
        this.drawLayer = drawLayer;

        this.x = coords.x;
        this.y = coords.y;

        this.fadeDuration = fadeDuration;
        this.fadeSpeed = Math.max(1/this.fadeDuration, 0.01); //default to fade duration of 0.01 if none is specified


        //create the graphics device for displaying on screen
        this.graphicsDevice = new PIXI.Graphics();
        this.graphicsDevice.lineStyle(4, 0xffd900, 1);


        this.graphicsDevice.beginFill(this.hex);
        this.graphicsDevice.moveTo(0, 0);
        this.graphicsDevice.lineTo(-this.size / 2, -this.size /4);
        this.graphicsDevice.lineTo(-this.size/4, -this.size / 2);
        this.graphicsDevice.lineTo(0, 0);
        this.graphicsDevice.closePath();

        this.graphicsDevice.lineTo(this.size / 4, -this.size /2);
        this.graphicsDevice.lineTo(this.size/2, -this.size / 4);
        this.graphicsDevice.lineTo(0, 0);
        this.graphicsDevice.closePath();

        this.graphicsDevice.lineTo(-this.size / 2, this.size /4);
        this.graphicsDevice.lineTo(-this.size/4, this.size / 2);
        this.graphicsDevice.lineTo(0, 0);
        this.graphicsDevice.closePath();

        this.graphicsDevice.lineTo(this.size / 4, this.size /2);
        this.graphicsDevice.lineTo(this.size/2, this.size / 4);
        this.graphicsDevice.lineTo(0, 0);
        this.graphicsDevice.closePath();

        this.graphicsDevice.endFill();

        //initialize the graphics at the right position
        this.drawLayer.addChild(this.graphicsDevice);
        this.graphicsDevice.x = this.x;
        this.graphicsDevice.y = this.y;


    }

    update(delta){
        //reduce the opacity accordingly with the fade duration
        this.graphicsDevice.alpha -= delta * this.fadeSpeed;

    }


}