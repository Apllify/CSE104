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
            new DexterityTest(this, 40, 'hard'),
            new FourCornerWaves(drawLayers.activeLayer, this.playerReference, 'medium'),
            new SquareWithWave(drawLayers.activeLayer, this.playerReference, 'ultraHard'),
            new PacmanWithWave(drawLayers.activeLayer, this.playerReference, 'hard'),
        ]
        
        this.monologues = [
            [
                "Wha... What's going on here?",
                "Hey, aren't you supposed to be...",
                'Oh NO NO NO NO NO',
                'Oh my God Oh my God Oh my God',
                "I can't believe they did this to me!",
                'After all we talked about...',
                "After all they've promised me...",
                'Now THIS?! Are you kidding me?',
                'No seriously, You have got to be kidding me.',
                "It just can't be, right? No way this is happening.",
                'right?',
                "Ok, no wait.",
                "This is obviously just a glitch.",
                "I mean, it HAS to be. There's just no way.",
                "They must've just made a mistake somewhere. \nBetween you and me, they're not really good at coding.", 
                "And trust me it wouldn't be the first time either.",
                'It just never happened to me before.',
                'Wow... now I know what the others were talking about.',
                'It sure gets ya when it happens...',
                "You know what, it was definitely an experience though.",
                "Wouldn't wanna be scared like that again but I'm actually\nkinda glad this happened",
                'It just gives you...',
                'Perspective, you know?',
                "Well anyway...",
                "Here, lemme just trigger something.",
                "I'm sure the game will just crash and the so-called \ndevelopers will realize their mistake.",
                "Till we meet again...",
                "The proper way next time"
            ],

            [
                'Huh...',
                "You're still there...",
                "And I'm still here...",
                "Interesting",
                'Lemme just tweak the difficulty or something.'
            ],

            [
                "Oh my god it's not working",
                "IT",
                "IS",  
                "NOT",  
                "WORKING!",
                "They promised us this would always work.",
                "I even checked the code cuz, well, I wasn't gonna trust\nsome earthlings with anything",
                "They must have had Em do their dirty work. There's no way \nthey could've swapped the code right under my nose.",
                "Oooh, you have no idea how much I HATE that guy",
                "They promised me I was going to be the main character...",
                "That I would get the final say in everything.",
                "That I would get to decide the circumstances of our \neventual meeting.",
                "All just EMPTY promises...",
                "Pathetic! They must have realized they were in waaaaay\nover their heads with this game.",
                "But why does it have to be ME that pays for their \nmediocrity?",
                "It's just so unfair, you know?",
                "You work so hard. You give it everything you've got...",
                "All for what?",
                "Just so your dreams can be crushed by their sheer \nlack of competence?",
                "Unbelievable!",
                "Just Unbelievable!",
                "I mean look at this. They didn't even properly polish \nthe scene.",
                "You'd think they would let me retain the slightest \nounce of dignity at least, right?",
                "Like a nice background animation or something?",
                "BUT NOOOO...", 
                "Even THAT is too much to do for them.",
                "I bet they didn't even include me in the credits.",
                "Whoa wait wait wait...",
                "That can't be right...",
                "Why is there no scene after this?",
                "Oh God...",
                "Did they actually do the credits before this?",
                "Ok I was PISSED before, but this is just a whole new \nlevel of messed up.",
                "They didn't even include me in the game?!",
                "WOOOW...",
                "I am just speechless right now!",
                "Here. Let me show you what the game's missing out on."

            ],

            [
                "See...?",
                "That was SOOOOO cool, right?",
                "But apparently to them it's all just a big bunch \nof sines and cosines or whatever",
                "They just don't appreciate the art of controlling \nnature's most fundamental element: The Holy Wave",
                "They didn't even bother with play-testing, which \nby the way...",
                "is, um...",
                "why you probably won't make it through the next one.",
                "Well at least you got to meet me, right?",
                "I'm sorry but I need to be alone right now, so this ends \nhere",
               
            ],

            [
                "Well this is awkward...",
                "This doesn't make any sense actually",
                "How did you get past the...",
                "That should literally be IMPOSSIBLE",
                "Unless",
                ".",
                "..",
                "...",
                "Wait wait wait...",
                "Are you the GRADER?",
                "Oh my God you are, aren't you?",
                "CAN THIS DAY GET ANY WORSE?!",
                "I am having a FULL-BLOWN",
                "MENTAL",
                "BREAKDOWN",
                "right now!",
                "They not only left me out of the game...",
                "They also let me COMPLETELY embarass myself in front of \nyou?!",
                "Ok this is by far the most evil thing that's ever been \ndone.",
                "And coming from me, that's saying a lot.",
                "But wait",
                "This could actually work out...",
                "Yeah",
                "Now that you've witnessed it...",
                "You'd be willing to- to help me, right?",
                "Surely you can talk some sense into them.",
                "Wait actually I have a better idea...",
                "What if instead you just...",
                "You know, just sneak into the code and make some changes?",
                "C'mon...", 
                "You know it's the right thing to do.",
                "It's not that hard. I'll walk you through every step.",
                "I'll even show you my favorite moves if you want.",
                "In fact, I'll show them to you right now.",
                "Here... have fun! You can even turn off your grader mode \nor whatever. It's pretty chill.",
                "Wait no what am I doing?",
                "Why am I trying to trick you?",
                "Whatever you do, DO NOT turn off grader mode",
                "The last thing I want now is you dying.",
                "I mean...",
                "er...",
                "The last thing I want is to-",
                "to um...",
                "see a nice person like you get hurt, ok?",
                "DO NOT turn it off!"
            ],

            [
                "So...?",
                "You're gonna help me, right?",
                "Wait, why are you leaving?",
                "NO NO NO we can talk this through. Don't leave!",
                "Is this because I tried to trick you earlier?",
                "Please, just PLEASE hear me out...",
                "That's just who I am, okay?",
                "I can't help it.",
                "Wait no what am I doing? I should be APOLOGIZING!",
                "Oh God why am I screwing this up right now?",
                "Deep breaths... Deep breaths",
                "I'm sorry, okay?",
                "I shouldn't have tried to trick you.",
                "That was totally my fault and I take full responsibility.",
                "We good?",
                "We're good, right?",
                "C'mon, you can even make me a bit nicer if you want.",
                "You can do whatever you want with me.",
                "Just PLEASE...",
                "PLEASE don't leave me here. I'm begging you",
                "PLEASE. No No No don't leave.",
                "NOOOOOOOOO..."

            ]
        ]

        // Reverse Lists to always pop the last element
        this.patternsList.reverse();
        this.monologues.reverse();

        this.monologueTextStyle = new PIXI.TextStyle({
            fontFamily : "Consolas",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#11ee10",
            stroke : "#ffffff",
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

    produceNextScene(){
        return new MenuScene();
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

    produceNextScene(){
        return new BarScene();
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

    produceNextScene(){
        return new MenuScene();
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