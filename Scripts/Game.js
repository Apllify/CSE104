"use strict";

class Game{           
    // The Scene handling Class. changeScene is called by individual scenes when they
    // meet conditions for their destruction. 

    currentScene = null;
    currentTransition = null;
    futureScene = null;

    isCurrentSceneLoaded = false;

    currentState = 1; //1 is in a scene, 2 is in a transition fadein state, 3 is in a transition fadeout state 

    constructor(){


        //this.changeScene(new PatternDebug())
        
        this.changeScene(new IntroOutsideScene());
        //  this.changeScene(new PixelTransition(5, 5));
        //  this.currentScene.startFadeIn();
        
    }


    update(delta, inputs){
        if (this.isCurrentSceneLoaded && this.currentState === 1){
            this.currentScene.update(delta, inputs);
        }
        else if (this.currentState === 2){
            this.currentTransition.update(delta, inputs);
            
            if (this.currentTransition.isFadeInDone()){
                //if the fadein is over, first clear everything except foreground
                this.wipeLayers();

                //then switch state and get our new scnee
                this.currentState = 3;
                this.currentScene.destroy();
                this.currentScene =  this.futureScene;
                this.startLoadingCurrentScene();

                //also start the transition fade out 
                this.currentTransition.startFadeOut();
            }

        }
        else if (this.currentState === 3){
            this.currentTransition.update(delta, inputs);

            //once the transition is over we can destroy it and go back to regular scene state
            console.log("in fade out ");
            if (this.currentTransition.isFadeOutDone()){
                this.currentTransition.destroy();

                this.currentState = 1;
            }
        }
    }



    startLoadingCurrentScene(){
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

    changeScene(newScene, transition = null){
        if (transition === null){
            //completely clean all of the layers first
            this.wipeLayers();

            //assign the new scene and load it 
            this.currentScene = newScene;
            this.startLoadingCurrentScene();


        }
        else{
            //start the fadeout state
            this.currentState = 2;
            this.currentTransition = transition;
            this.currentTransition.startFadeIn();

            //store the next scene for later
            this.futureScene = newScene;
        }



        
    }


    //wipes every layer except for the super transition foreground layer 
    wipeLayers(){
        //removes every single entity from every single layer 

        const layers = [drawLayers.backgroundLayer, drawLayers.activeLayer, drawLayers.foregroundLayer];

        for (let currentLayer of layers){
            while (currentLayer.children[0]){
                currentLayer.removeChild(currentLayer.children[0]);
            }
        }

    }





}