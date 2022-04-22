"use strict";

class Game{           
    // The Scene handling Class. changeScene is called by individual scenes when they
    // meet conditions for their destruction. 

    constructor(){
        drawLayers;
        // this.currentScene = new OutsideParam(drawLayers);
        // this.currentScene.setMapMatrix([[2, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
        // this.currentScene = new OutsideScene(this.drawLayers);
        // this.currentScene.setMapMatrix([[0,0,0,0], [0, 0, 2, 1], [0, 0,0, 0], [0, 0, 0, 0]]);

        this.currentScene = new MenuScene();
    }


    update(delta, inputs){
        this.currentScene.update(delta, inputs);
    }

    changeScene(newScene){
        this.currentScene.destroy();
        this.currentScene = newScene;
        // some scenes have a startScene method to avoid starting them as soon as they are created
        if (this.currentScene.startScene != undefined){
            this.currentScene.startScene();
        }
        
    }


    loadFirstGameScene(){
        const firstScene = new OutsideScene();
        firstScene.setMapMatrix([[2, 1, 1, 1, 1, 1]]);
        this.changeScene(firstScene);
    }
}