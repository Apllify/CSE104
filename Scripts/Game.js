"use strict";

class Game{           
    // The Scene handling Class. changeScene is called by individual scenes when they
    // meet conditions for their destruction. 

    constructor(drawLayers){
        this.drawLayers = drawLayers;
        // this.currentScene = new OutsideParam(drawLayers);
        // this.currentScene.setMapMatrix([[2, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
        this.currentScene = new OutsideScene(this.drawLayers);
        this.currentScene.setMapMatrix([[0,0,0,0], [0, 0, 2, 1], [0, 0,0, 0], [0, 0, 0, 0]]);
    }

    update(delta, inputs){
        this.currentScene.update(delta, inputs);
    }

    changeScene(newScene){
        this.currentScene.destroy();
        this.currentScene = newScene;
    }
}