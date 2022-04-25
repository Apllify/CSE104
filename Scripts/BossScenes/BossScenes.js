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


    //called once the sprites are loaded

    initialize(){
        this.patternsList = [
            new FourCornerWaves(drawLayers.activeLayer, this.playerReference, 'easy'),
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



    load(){
        super.load();

    }



    produceBreak(breakCount){
        // produce the next non-pattern interaction. In this case it is only monologues.
        this.playerReference.pause();
        return new Monologue(drawLayers.foregroundLayer, this.monologues.pop(), this.monologueTextStyle,
        "Surfer Boss", 1);

    }

    producePattern(patternCount){
        // produce the next pattern 
        this.playerReference.unpause();
        let newPattern = this.patternsList.pop();
        newPattern.activate();
        return newPattern;

    }

    breakUpdate(delta, inputs){

    }

    patternUpdate(delta, inputs){
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