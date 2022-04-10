class FadeText extends TextDisplay{

    fadeDuration;
    fadeSpeed;
    opacity;
    constructor(drawLayer, textContent, position, textStyle, fadeDuration = 1){
        super(drawLayer, textContent, position, textStyle);

        this.fadeDuration = fadeDuration;
        this.fadeSpeed =  1/fadeDuration;
    }

    update(delta,inputs){
        
    }
}