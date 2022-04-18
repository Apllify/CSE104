"use strict";
class FadeText extends TextDisplay{

    fadeDuration;
    fadeSpeed;
    alpha = 0;    // the current alpha value. Set to 1 each time we initiate a fading animation. 

    
    constructor(drawLayer, textContent, position, textStyle, fadeDuration = 1){
        super(drawLayer, textContent, position, textStyle, 0);
        // initialize the textDisplay with an alpha value of 0.

        this.fadeDuration = fadeDuration;    
        this.fadeSpeed =  1/fadeDuration;  
    }

    update(delta,inputs){    // delta is the amount of seconds since the last frame and the alpha value
                            // for this frame is calculated based on the fadeSpeed. The animation 'ends'
                            // when alpha reaches 0. 
        this.alpha = Math.max(0, this.alpha - (delta * this.fadeSpeed))
        this.textEntity.alpha = this.alpha; 
    }

    initiate(){         // start fadeText Animation.
        this.alpha = 1;
    }

    isDone(){
        return (this.alpha === 0);
    }
}