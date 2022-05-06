"use strict";

class FadeTransition{
    state = 0; // 1 is fading in, 2 is waiting before fading out, 3 is fading out,  4 is done with everything 

    fadeInTime = 5;
    fadeOutTime = 1;

    waitTime = 3;
    currentWaitingTimer = 0;

    fadeInSpeed = 1/5;
    fadeOutSpeed = 1/1;

    graphics = null;


    //stuff to be used by the game instance that is going to load 
    allowUpdate= true;
    newSceneState = 2;


    
    constructor(fadeInTime, waitTime, fadeOutTime){
        this.fadeInTime = fadeInTime;
        this.waitTime = waitTime;
        this.fadeOutTime = fadeOutTime;

        this.fadeInSpeed = 1/ this.fadeInTime;
        this.fadeOutSpeed = 1 / this.fadeOutTime;

        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill("0x000000");
        this.graphics.drawRect(0, 0, 800, 600);
        this.graphics.endFill();

        this.graphics.alpha = 0;

        drawLayers.transitionForegroundLayer.addChild(this.graphics);
    }


    update(delta, inputs){
        if (this.state === 1){
            //make the screen dimmer and dimmer
            this.graphics.alpha = Math.min(1, this.graphics.alpha + delta * this.fadeInSpeed);
        }
        else if (this.state === 2){
            this.currentWaitingTimer += delta;
            
            if (this.currentWaitingTimer >= this.waitTime){
                this.state = 3;
            }
            
        }
        else if (this.state === 3){
            //make the screen clearer and clearer
            this.graphics.alpha = Math.max(0, this.graphics.alpha - delta * this.fadeOutSpeed);
        }

    }

    startFadeIn(){
        this.state = 1.
    }

    isFadeInDone(){
        return (this.graphics.alpha >= 1);
    }

    startFadeOut(){
        this.state = 2;
    }

    isFadeOutDone(){
        return (this.graphics.alpha <= 0 );
    }

    destroy(){
        this.graphics.destroy();
    }
}