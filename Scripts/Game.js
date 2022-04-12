"use strict";
class Game{           // The Scene handling Class. changeScene is called by individual scenes when they
    // meet conditions for their destruction. 
    constructor(drawLayers){
        this.drawLayers = drawLayers;
        this.currentScene = new MenuScene(drawLayers, this)
    }
    update(delta, inputs){
        this.currentScene.update(delta, inputs);
    }
    changeScene(newScene){
        this.currentScene.destroy();
        this.currentScene = newScene;
    }
}