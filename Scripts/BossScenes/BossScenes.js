// This file contains all the boss scenes
"use strict";
class SurferBoss extends SuperBoss{
    // State 0 corresponds to a pattern. We initialize the current state to 0 because we want a monologue
    // first. 

    
    
    currentState = 0;
    patternsList = [];
    
    monologues = [];
    monologueTextStyle = {};

    elapsedPatternTime = 0;
    projectileColor = 0x11ee10;
    // period of background oscillation
    period = 8;

    constructor(){
        super();
        this.requiredAssets['SurferBackgroundBottom'] = 'Sprites/SurferBackgroundBottom.png';
        this.requiredAssets['SurferBackgroundTop'] = 'Sprites/SurferBackgroundTop.png';

        const dexterityAssets = {
            'u': 'Sprites/up.png',
            'd':'Sprites/down.png',
            'r':'Sprites/right.png',
            'l':'Sprites/left.png'
        };

        this.requiredAssets = {...this.requiredAssets, ...dexterityAssets};

        
    }

    load(){
        this.backgroundTop = new PIXI.Sprite(PIXI.Loader.shared.resources["SurferBackgroundTop"].texture);
        this.backgroundBottom = new PIXI.Sprite(PIXI.Loader.shared.resources["SurferBackgroundBottom"].texture);
        this.background = [this.backgroundTop, this.backgroundBottom]
        for (let background of this.background){
            background.scale.x = 2;
            background.scale.y = 2;
            background.alpha = 0.2;
            background.x = -100
            drawLayers.backgroundLayer.addChild(background);
        }
        // this.shade = new PIXI.Graphics();
        // //create a teeny tiny bit of shade over the scene
        // this.shade = new PIXI.Graphics();
        // this.shade.beginFill(0x000000);
        // this.shade.drawRect(0, 0, 800, 600);
        // this.shade.endFill();

        // this.shade.alpha = 0.6

        // drawLayers.foregroundLayer.addChild(this.shade);
        this.backgroundTop.y = -90;
        this.backgroundBottom.y = 300;
        this.period = 8

       
        super.load();
        

    }

    //called once the sprites are loaded

    initialize(){
        this.patternsList = [
            new DexterityTest(this, 50, 'medium'),
            new FourCornerWaves(drawLayers.activeLayer, this.playerReference, 'easy'),
            new PacmanWithWave(drawLayers.activeLayer, this.playerReference, 'medium'),
            //new SquareWithWave(drawLayers.activeLayer, this.playerReference, 'hard')
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
            fill : "#00ff00",
            stroke : "#00ff00",
        });
    }



    update(delta, inputs){
        super.update(delta, inputs);
        
        
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

    
    patternUpdate(delta, inputs){
        // oscillating background
        for (let i = 0; i < this.background.length; i++){
            this.background[i].x = -100 + ((-1) ** i) * 100 * Math.sin(2 * Math.PI * this.elapsedPatternTime / this.period)
        }
        if (this.elapsedPatternTime >= 1000 && Math.cos(2 * Math.PI * this.elapsedPatternTime / this.period) >= 0.97){
            this.elapsedPatternTime = 0;
        }
        this.elapsedPatternTime += delta;
    }

    sceneOver(){
        return (this.monologues.length === 0 && this.patternsList.length === 0);
    }
    
    sceneOverAction(){
        window.localStorage.setItem('SurferComplete', 1)
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

    yellingTextStyle = undefined;
    crypticTextStyle = undefined;
    defaultTextStyle = undefined;
    
    // store a copy of the most recent pattern in case we need to restart it 
    mostRecentPattern = null;
    projectileColor = 0xdd2189;

    constructor(){
        super();
    }

    initialize(){
        this.patternsList = [
            new RainPattern(drawLayers.activeLayer, this.playerReference, 'medium'),

            new SquarePattern(drawLayers.activeLayer, this.playerReference, 150),
            
            // new SquareCirclePattern(drawLayers.activeLayer, this.playerReference, "medium"),

            // new PacmanSquare(drawLayers.activeLayer, this.playerReference, "easy"),

            // new SquareCirclePacman(drawLayers.activeLayer, this.playerReference, "medium")

        ];

        this.monologues = [
            ["Uh- Uhmmm... Allow me to clear m-my throat..",
            "You are SOOOO not supposed to be here.",
            "S-so...",
            "Your name's ${this.playerReference.name}, \nright ?",
            "Oh god, oh no, I'm so sorry let me redo this....",
            "(Nightmare...Nightmare...Nightmare...Nightmare...Nightmare...Nightmare...Nightmare... )",
            "(Why?)",
            "(Why did it have to be right now?)",
            `You're ${this.playerReference.name}`,
            "I-i'm pretty sure that's your name, right ?", 
            "Ok.",
            "Whatever you do.",
            "NEVER NEVER NEVER introduce yourself as : \nPLAYER ",
            "...",
            "For your own confort and safety...",
            "Speaking of, I should - uhm - run you through \nthe combat basics ?",
            "Let's.",
            "(Ok, ok, ok, just, remember the training)",
            "See that little green bar at the top ? \nThat's your energy level or something.",
            "If it runs out, you'll get tired (?) And we'll have \nto take a break from fighting (i think).",
            "The fighting itself is pretty simple (not): Just \nmove around so the projectiles can't hit you.",
            "(There isn't a single chance that this works holy fuck)",
            "Let's try this for starters :)"],

            ["(Did I go too hard on them ?)",
            "(No clue, they weren't doing bad though)",
            "(Maybe.... This could ? work ?)",
            "Ahem.",
            "Great job, keep it up.",
            "That was some smooth movement.",
            "(Phew)",
            "Ok this next one is a l-little trickier. \nIt's kind of my speciality move.",
            "Don't stand still."
            ]

            // "It's the unspeakable, unbreakable compound \nthat makes up the living.",
            // "Well",
            // "Unbreakable is a strong word actually, \nbecause modern technology kind of ? Throws the entire premise of it \nout the window ?",
            // "The industrial revolution and its consequences have been devastating for mankind AMIRITE ???",
            // "...",
            // "....",
            // ".....",
            // "You should really look out for that bar because \nif it runs out you",
            // "die an agonizing death.",
            // "Anyways, let's get straight into it, \nthink fast !"],


        //     ["Hint : use W,A,S,D to dodge the projectiles",
        //     "Maybe I should've told you that before actually",
        //     "Also, why is my name tutorial? ",
        //     "Do they realize I'm not \njust a one-time character lol?",
        //     "You'd think that they'd spend a little more time \nstoryboarding, you know, their main character?",
        //     "Ugh, I guess it's not that important ... \nHere's my signature pattern ! "],


        //     ["Did I just say signature pattern ?",
        //     "Sorry, I meant one of the many colorful \nand flashy attacks of my main character toolkit",
        //     "Yup",
        //     "It's kinda hard to choose when you have that \nmany options really",
        //     "Look at this for example :"],


        //     ["Heh, impressive right ? ",
        //     "Took me 8 years to master",
        //     "Maybe I can teach you once I'm done with my \nmain character(tm) storyline",
        //     "Anyways",
        //     "NEXT"
        // ], 


        //     ["Phew, you're kind of resilient for an npc, \nyou sure you haven't done this before ? ",
        //     "That's not a compliment by the way, \njust an observation",
        //     "Obviously",
        //     "Sorry if you got your ego up",
        //     "This should help you simmer down",
        //     "Ladies and Gentlemen",
        //     "Make noise for",
        //     "My ULTIMATE PATTERN"
        // ],

        // ["I- ",
        // "That-",
        // "Uh-",
        // ]
        ];

        // Reverse Lists to always pop the last element
        this.patternsList.reverse();
        this.monologues.reverse();

        this.defaultTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 25,
            fontWeight : "bold",
            fill : "#ffffff",
        });


        this.slightlySmallerTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#ffffff",
        });

        this.explanationTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 15,
            fontWeight : "bold",
            fill : "#ffffff",
        });

        this.yellingTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 40,
            fontWeight : "bold",
            fill : "#ffffff",
        });

        this.crypticTextStyle = new PIXI.TextStyle({
            fontFamily : "Microcosmos",
            fontSize : 60,
            fontWeight : "bold",
            fill : "#ffffff",
        });
    }

    produceBreak(breakCount){
        this.playerReference.pause();

        //choose the adequate font depending on the message
        let monologue = new Monologue(drawLayers.foregroundLayer, this.monologues.pop(), this.defaultTextStyle, 'Tutorial', 1);

        if (breakCount === 0){
            monologue.setTextStyleException(21, this.slightlySmallerTextStyle);
        }

        // //add some styling for the first dialogue
        // if (breakCount === 0){
        //     monologue.setTextStyleException(1, this.yellingTextStyle);

        //     //monologue.setShakingException(0);
        //     //monologue.setShakingException(1);

        //     //monologue.setShakingException(8);

        //     //monologue.setTextStyleException(6, this.yellingTextStyle);
        //     //monologue.setTextStyleException(8, this.crypticTextStyle);
        //     //monologue.setTextStyleException(11, this.explanationTextStyle);
        //     //monologue.setTextStyleException(12, this.explanationTextStyle);
    
        // }
        // else if (breakCount === 4){
        //     monologue.setTextStyleException(7, this.yellingTextStyle);
        //     monologue.setShakingException(7);
        // }
        // else if (breakCount == 5){
        //     monologue.setTextStyleException(0, this.explanationTextStyle);
        //     monologue.setTextStyleException(1, this.explanationTextStyle);
        //     monologue.setTextStyleException(2, this.explanationTextStyle);

        // }



        return monologue;
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
        return (this.monologues.length === 0 && this.patternsList.length === 0);
    }

    sceneOverAction(){
        window.localStorage.setItem('TutorialComplete', 1)
    }

    restart(){
        mainGame.changeScene(new TutorialBoss());
    }

    quit(){
        mainGame.changeScene(new MenuScene());
    }
}


class PatternDebug extends SuperBoss{
    currentState = 1;

    patternsList = [];
    
    monologues = [];

    constructor(){
        super();
    }

    initialize(){
        this.patternsList = [
            new SquareCirclePacman(drawLayers.activeLayer, this.playerReference, "medium")
        ]
    }

    load(){
        // creates the player and the first object
        this.playerReference = new Character({x:400, y:300}, drawLayers.activeLayer);
        this.initialize();

        this.currentObject = this.producePattern(this.patternCount);
        this.patternCount ++;
        this.currentState = 0;

    }

    producePattern(patternCount){
        let newPattern = this.patternsList.pop();
        newPattern.activate();
        return newPattern;
    }

    sceneOver(){
        return (this.monologues.length === 0 && this.patternsList.length === 0);
    }

    restart(){
        mainGame.changeScene(new PatternDebug());
    }

    quit(){
        mainGame.changeScene(new MenuScene());
    }
}