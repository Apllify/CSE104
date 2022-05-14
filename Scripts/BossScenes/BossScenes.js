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
        this.period = 2

       
        super.load();
        

    }

    //called once the sprites are loaded

    initialize(){
        this.patternsList = [
            new DexterityTest(this, 60, 'medium'),
            new DexterityTest(this, 50, 'hard'),
            new FourCornerWaves(drawLayers.activeLayer, this.playerReference, 'medium'),
            new SquareWithWave(drawLayers.activeLayer, this.playerReference, 'medium'),
            new PacmanWithWave(drawLayers.activeLayer, this.playerReference, 'medium'),
        ]
        
        this.monologues = [
            [
                "W-What's going on here.",
                "Where am I ???",
                "Wait, aren't you supposed to be - ",
                'Oh NO NO NO NO NO NONONONONONONONO NONONONONONONONONONO',
                'Oh my God, Oh my God, Oh my God',
                "...",
                'After everything we agreed on.',
                "All the promises...",
                'And this is what I get ?',
                "By Thalos, this can't be happening.",
                'Right?',
                "Ok, no wait.",
                "This is obviously just some practical joke.",
                "I'm gonna be back in the sewers any minute now.",
                ".",
                "..",
                "...",
                "Maybe they just ? made a mistake ?",
                "If I'm being honest, they're not really 'good' at \ncoding.", 
                "And trust me, it wouldn't be the first time either.",
                'It just never happened to me before.',
                'At least I know what the others were talking \nabout now.',
                'Huh.',
                'It definitely gives you...',
                'Perspective, you know?',
                "Well anyway...",
                "Fear not, I know how to get us out of here.",
                "I'll just use an unimplemeted feature.",
                "That way the game will crash and everything \ncan go back to normal.",
                "Brace yourself.",
            ],

            [
                'Huh.',
                "You're.", 
                "Still here.",
                "And I'm.",
                "Still here...",
                "Interesting.",
                'Let me just tweak the difficulty or something ?'
            ],

            [
                "Ok.",
                "Time to move on to plan B.",
                "EVERYTHING WAS A MISTAKE THE FOG IS COMING THE FOG IS COMING THE FOG IS COMING.",
                "Father in heaven, I stand before You today in Your omnipotent presence to ask that You grant me strength.",
                "I want You to give me the strength to power through all of the tasks today — whether little or big.",
                "It is by Your will that I live oh Lord. And I know it is also by Your will I will not go weak today.",
                "They swore that creating an attack phase would \njust crash everything ?",
                "I even checked the code cause, well, I wasn't \ngonna trust them with anything",
                "They promised me I was going to be the main \ncharacter...",
                "That I would get free will...",
                "That I would get to decide the circumstances of our \nmeeting together...",
                "...",
                "So pathetic, they didn't get anything right.",
                "But why do I have to be the one paying for their \nmediocrity?",
                "It's just so unfair.",
                "You work so hard. You spend years on the \npreparations.",
                "Practing every line, every delivery.",
                "And then this happens.",
                "Your dreams, crushed under an anvil of \nincompetence.",
                "I mean, look at this. They didn't even properly \npolish this scene.",
                "You'd think they'd let me retain the slightest \nounce of dignity at least, right?",
                "With a nice background animation or something?",
                "But no.", 
                "They don't even have the time for that.",
                "I bet they didn't even include me in the credits.",
                "Whoa -",
                "Wait wait wait wait.",
                "That can't be right...",
                "Why is there no scene after this?",
                "Oh God.",
                "Did they actually do the credits before this???",
                "Ok I was PISSED before, but this is just too much.",
                "I'm not even in the main game ?????",
                "Wow.",
                "I have no words.",
                "Here. Let me show you what they're missing out on."

            ],

            [
                "See...?",
                "That was SOOOOO cool, right?",
                "But apparently to them it's just 'unbalanced' \nand 'stretched out'",
                "They just don't appreciate the art controlling \nelements in the purest motion : waves.",
                "They didn't even bother with play-testing, which \nby the way...",
                "is, uhm...",
                "why you probably won't make it through the next \none.",
                "Well at least you got to meet me, right?",
                "Alright, here goes.",
               
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
                "Could you be ?",
                "Actually good at the video game ?",
                "I didn't plan for this wtf.",
                "They not only left me out of the game...",
                "But they also didn't warn me at all about you ???",
                "But wait.",
                "Maybe this could actually work out...",
                "Yeah.",
                "Now that you've witnessed it...",
                "You'd be willing to-", 
                "You'd be willing to to help me, right?",
                "Just your friendly neighborhood boss haha.",
                "Surely you can talk some sense into them.",
                "Wait actually I have a better idea...",
                "What if instead you just...",
                "You know, just sneak into the code and make some \nchanges?",
                "C'mon.",
                "Add me to the game.", 
                "You know it's the right thing to do.",
                "It's not that hard. I'll walk you through every step.",
                "I'll even show you my favorite moves if you want.",
                "In fact, I'll show them to you right now.",
                "Here... have fun! I'll even refill your healthbar \nor whathever. It's pretty chill.",
            ],

            [
                "So...?",
                "You're gonna help me, right?",
                "There's no extra content after this.",
                "You only have a few enter presses left and....",
                "NO NO NO we can talk this through. You're gonna \nhelp your pal right ?",
                "Focus about the good times.",
                "Remember when I showed you that sick wave \npattern ?",
                "Please, just please hear me out...",
                "That's just who I am, okay?",
                "I really really didn't want to kill you",
                "I mean even in the main game why would I do that ?",
                "I act all tough and emo but you have no idea how \nlong I've spent - ",
                "Preparing for this moment.",
                "And now, it's here, and I'm just messing everything \nup.",
                "I just can't help it.",
                "I'm sorry.",
                "Ok Deep breaths... Deep breaths",
                "I'm really sorry, okay?",
                "I shouldn't have tried to kill you at the start.",
                "That was totally my fault and I take full \nresponsibility.",
                "We good?",
                "We good, right?",
                "C'mon, I'll play with you whenever you want.",
                "Just PLEASE...",
                "PLEASE don't leave me here. I'm begging you",
                "PLEASE. Don't press enter.",
                "We can stay here for the rest of time.",
                "Just me and you, enjoying a nice bonding moment.",
                "Right ?",
                "Right ????",
                "Please don't do it.",
                "I have so much to live for...",
                "Oh.",
                "You're still going.",
                "Well.",
                "I guess this it it.",
                "Goodbye."

            ]
        ]

        // Reverse Lists to always pop the last element
        this.patternsList.reverse();
        this.monologues.reverse();

        this.monologueTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#ffffff",
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


        //start healing starting from pattern of index 3
        if (patternCount >= 3){
            this.playerReference.refillHealth();
        }

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
            
            new SquareCirclePattern(drawLayers.activeLayer, this.playerReference, "medium"),

            new PacmanSquare(drawLayers.activeLayer, this.playerReference, "easy"),

            new SquareCirclePacman(drawLayers.activeLayer, this.playerReference, "medium")

        ];

        this.monologues = [
            [
                "Uh- Uhmmm... Allow me to clear m-my throat..",
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
                "Let's try this for starters :)"
            ],

            [
                "(Did I go too hard on them ?)",
                "(No clue, they weren't doing bad though)",
                "(Maybe.... This could ? work ?)",
                "Ahem.",
                "Good job, keep it up.",
                "That was pretty decent.",
                "(Phew)",
                "Ok this next one is just a little trickier. \nIt's kind of my signature move.",
                "Don't stand still."
            ],

            [
                "Hint : Use W,A,S,D to dodge the projectiles.",
                "(What am I even saying, this is the third pattern \n?????????????)",
                "Anyways, did I just say signature move ?",
                "Sorry, I meant one of the many colorful \nand flashy attacks of my tutorial toolkit.",
                "Yup.",
                "It's kinda hard to choose when you have that \nmany options really.",
                "Here's another one for example : "
            ],

            [
                "I.",
                "*Tutorial looks physically unwell.*",
                "Forgot all of my other attacks actually.",
                "(It's okay.)",
                "(I can still train them.)",
                "(Nothing bad's gonna happen, I'm just gonna \nescort them and - )",
                "(Go to cuba, live out the rest of my life under a \nfake name, it's the only option the only option)",
                "(Just calm down, and don't pass out on them.)",
                "Let's try something else."
            ],

            [
                "Look at you go.",
                "You're a fast learner.",
                "You'll beat me in a day or two of training at \nthis rate, haha.",
                "(They're gonna die to 5 centimeter rodent \nand it's all gonna be my fault.)",
                "Hahaha.",
                "Ha.",
                "Ready for this next one ?"
            ],

            [
                "Nice !",
                "So let me run you down our training plan.",
                "We're gonna meet up here everyday for - ",
                "...",
                "",
                "...",
                "",
                "...",
                "",
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