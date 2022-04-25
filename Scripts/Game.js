"use strict";

class Game{           
    // The Scene handling Class. changeScene is called by individual scenes when they
    // meet conditions for their destruction. 

    currentScene = null;
    isCurrentSceneLoaded = false;

    constructor(){
        // this.currentScene = new OutsideParam(drawLayers);
        // this.currentScene.setMapMatrix([[2, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
        // this.currentScene = new OutsideScene(this.drawLayers);
        // this.currentScene.setMapMatrix([[0,0,0,0], [0, 0, 2, 1], [0, 0,0, 0], [0, 0, 0, 0]]);

        //this.changeScene(new PatternDebug())
        this.changeScene(new MenuScene());
    }


    update(delta, inputs){
        if (this.isCurrentSceneLoaded){
            this.currentScene.update(delta, inputs);
        }
    }

    changeScene(newScene){
        //completely clean all of the layers first
        this.wipeLayers();

        //assign the new scene
        this.currentScene = newScene;
        this.isCurrentSceneLoaded = false;

        //load the assets required by the scene
        if (this.currentScene.requiredAssets === undefined){
            if (this.currentScene.load !== undefined){
                this.currentScene.load();
            }
            this.isCurrentSceneLoaded = true;
        }
        else{
            //clear the loader 
            PIXI.Loader.shared.reset();


            //load every single required asset
            for (let i = 0; i < Object.keys(this.currentScene.requiredAssets).length ; i++){
                let currentAssetName = Object.keys(this.currentScene.requiredAssets)[i];
                PIXI.Loader.shared.add(currentAssetName, this.currentScene.requiredAssets[currentAssetName]);


            }

            //call the load method only once all of the assets have been properly loaded
            PIXI.Loader.shared.load(() => {
                this.isCurrentSceneLoaded = true;
                if (this.currentScene.load !== undefined){
                    this.currentScene.load();
                }
            })
        }


        
    }

    wipeLayers(){
        //removes every single entity from every single layer 
        for (let i =0; i< Object.keys(drawLayers).length ; i++ ){
            let currentLayer = drawLayers[Object.keys(drawLayers)[i]];

            while (currentLayer.children[0]){
                currentLayer.removeChild(currentLayer.children[0]);
            }
        }
    }



}