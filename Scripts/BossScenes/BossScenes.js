// This file contains all the boss scenes
"use strict";
class SurferBoss extends SuperBoss{
    // State 0 corresponds to a pattern. We initialize the current state to 0 because we want a monologue
    // first. 
    currentState = 0;
    patternsList = [];
    
    monologues = [];
    monologueTextStyle = {};


    constructor(){
        super();
    }

    initializeObjects(){
        this.patternsList = [
            new FourCornerWaves(drawLayers.activeLayer, this.playerReference, 'ultraHard'),
            new PacmanWithWave(drawLayers.activeLayer, this.playerReference, 'medium'),
            new SquareWithWave(drawLayers.activeLayer, this.playerReference, 'hard')
        ]
        
        this.monologues = [
            ['Well hello there!', 'I am the surfer!'],
            ['Now Try this', "Arggghhhh"],
            ['YOU DARE DODGE MY PATTERNS YOU IMBECILE!',  'NOW YOU SHALL FEEL MY WRATH!'],
            [`Damn, GG ${this.playerReference.name}!`, 'Guess I underestimated ya', 'Till Next Time...']
        ]

        // Reverse Lists to always pop the last element
        this.patternsList.reverse();
        this.monologues.reverse();

        this.monologueTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#0000ff",
            stroke : "#0000ff",
        });
    }
    produceNextObject(){
        // We alternate between monologue and pattern
        if (this.currentState === 0){
            
            this.playerReference.pause();
            let textContent = this.monologues.pop();
            
            this.currentObject = new Monologue(drawLayers.foregroundLayer, textContent, this.monologueTextStyle,
                'Surfer Boss', 1);
            this.currentState = 1;
        }
        
        else{
            
            this.playerReference.unpause();
            this.currentObject = this.patternsList.pop();
            
            this.currentObject.activate();
            this.currentState = 0;
        }
    }

    sceneOver(){
        return (this.monologues === [] && this.patternsList === []);
    }

    restart(){
        mainGame.changeScene(new SurferBoss());
    }

    quit(){
        mainGame.changeScene(new MenuScene());
    }
}