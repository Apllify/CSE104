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


class TutorialBoss extends SuperBoss{
    // Tentative tutorial scene: to be adjusted once we figure out the attack mechanic\
    // So for now it's a simple rundown of some patterns with some dialogue.
    currentState = 0;
    patternsList = [];
    
    monologues = [];
    monologueTextStyle = {};
    
    // store a copy of the most recent pattern in case we need to restart it 
    mostRecentPattern = null;

    constructor(){
        super();
    }

    initialize(){
        this.patternsList = [
            new RainPattern(drawLayers.activeLayer, this.playerReference, 'medium'),
            new SquareCirclePattern(drawLayers.activeLayer, this.playerReference, 'easy'),
            new FourCornerWaves(drawLayers.activeLayer, this.playerReference, 'easy'),
            new PacmanSquare(drawLayers.activeLayer, this.playerReference, 'easy')
        ]

        this.monologues = [
            [`Welcome ${this.playerReference.name}!`, "That's right, I know your name", 
            "You're gonna have to be a little bit more conspicous in this town", 'Consider that your first lesson',
        "You took a big risk coming here", "But lucky for you, you came to the right place.",
    "Apply yourself well and this might just prepare you for what's coming", "So let's get straight into it, shall we?",
"Think Fast!"],
            ['Not bad, kid! Bit sloppy with the movement but we can work on that', "Let's try again with another one"],
            ["Remember: they won't go this easily on you", 'The key is always more practice'],
            ["Hope I didn't just ruin beaches for ya with dem waves", 'This next one involes pacman patterns',
        'The reasons for their name might not be apparent immediately', "But don't you worry...",
    'It is only the wisest of minds that could possibly comprehend them'], 
    ['Well there you have it!', 'My job here is done', 'Hope this was helpfull', 'Good Luck out there']
        ]

        // Reverse Lists to always pop the last element
        this.patternsList.reverse();
        this.monologues.reverse();

        this.monologueTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 16,
            fontWeight : "bold",
            fill : "#ff00ff",
            stroke : "#ff00ff",
        });
    }

    produceBreak(breakCount){
        this.playerReference.pause();
        return new Monologue(drawLayers.foregroundLayer, this.monologues.pop(), this.monologueTextStyle, 'Tutorial', 1);
    }

    producePattern(breakCount){
        // produce the next pattern 
        this.playerReference.unpause();
        // we refill the player's health in each new pattern in this tutorial
        this.playerReference.refillHealth();
        let newPattern = this.patternsList.pop();
        
        this.mostRecentPattern = newPattern.clone();
        newPattern.activate();
        return newPattern;
    }

    restartPattern(){
        this.currentObject.destroy();
        this.currentObject = this.mostRecentPattern;
        this.mostRecentPattern = this.currentObject.clone();
        this.playerReference.refillHealth();
        this.playerReference.x = 400;
        this.playerReference.y = 300;
        this.currentObject.activate();
        // if it is called in a gameOver situation
        this.gameOver = false;
    }

    pauseHandle(){
        if (this.paused || this.currentState == 1){
            super.pauseHandle();
        }

        else{
            this.pauseScreen =  new PauseScreen(drawLayers.foregroundLayer, this, ['Resume', 'Restart', 'Restart Pattern', 'Quit'],
            {0: 'resume', 1:'restart', 2:'restartPattern', 3: 'quit'});
            this.paused = true;
        }
    }

    gameOverHandle(){
        // called when the player dies 
        this.pauseScreen = new PauseScreen(drawLayers.foregroundLayer, this, 
            ['Restart Tutorial', 'Retry Pattern', 'Quit'], {0:'restart', 1:'restartPattern' ,2:'quit'}, 'Try Harder!');
        this.gameOver = true;
        this.paused = true;
    }

    sceneOver(){
        return (this.monologues === [] && this.patternsList === []);
    }

    restart(){
        mainGame.changeScene(new TutorialBoss());
    }

    quit(){
        mainGame.changeScene(new MenuScene());
    }
}