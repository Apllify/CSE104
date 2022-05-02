class TextNpc extends Npc{
    monologuesList =[]; //list of lists

    textStyle = undefined;
    name = "";

    spritePath = "";
    sprite = null;

    constructor(drawLayer, playerReference, position, textStyle, monologuesList, name, spritePath){
        super(drawLayer, playerReference, position);

        this.monologuesList = monologuesList;

        this.name = name;
        this.textStyle = textStyle;

        this.spritePath = spritePath;
    }

    setupGraphics(scaleX, scaleY){
        //assumes the sprite has already been loaded
        this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[this.spritePath].texture);
        this.drawLayer.addChild(this.sprite);

        this.sprite.scale.x = scaleX;
        this.sprite.scale.y = scaleY;

        this.sprite.x = this.x - this.sprite.width / 2 ;
        this.sprite.y = this.y - this.sprite.height / 2 ;



        //this.sprite = PIXI.Sprite.from(this.spritePath);
        //this.drawLayer.addChild(this.sprite);

        //this.sprite.x = this.x - this.sprite.width / 2;
        //this.sprite.y = this.y - this.sprite.height / 2;

    }



    destroyGraphics(){
        this.sprite.destroy();
    }
    

    //returns an element of type monologue
    isInteracted(index){
        //prevent the player from moving 
        this.playerReference.pause();


        //advance the monologue by one if possible
        let currentMonologueIndex = Math.min(this.monologuesList.length - 1, index);

        //determin the vertical offset based on the player position
        const verticalOffset= (this.playerReference.y > 300) ? 0 : 1;


        return new Monologue(drawLayers.foregroundLayer, this.monologuesList[currentMonologueIndex ], this.textStyle,
            this.name, verticalOffset);
    }


    isInteractingJustDone(){
        //unpause the player movement
        this.playerReference.unpause();
    }



    // destroyGraphics(){
    //     if (this.sprite !== null){
    //         this.sprite.destroy();
    //     }
    // }
}

class BrokenDoor extends TextNpc{
    constructor(drawLayer, playerReference, position){
        const monologuesList = [
            ["This door doesn't seem to open...",
        "Perhaps you should come back later..."]
        ];

        const textStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        super(drawLayer, playerReference, position, textStyle, monologuesList, "Broken Door",  "Shield");

    }

    setupHitbox(){
        this.hitbox = new Rectangle(this.x - 16, this.y - 16, 32, 32);
    }
}

class Rock extends TextNpc{
    constructor(drawLayer, playerReference, position, monologuesList){

        const textStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        super(drawLayer, playerReference, position, textStyle, monologuesList, "Rock",  "Rock");
 
    }


    setupHitbox(){
        
        this.hitbox = new Rectangle(this.x - 10, this.y - 10, 20, 20);
    }


}

class MiniStatic extends TextNpc{

    flickedPhase = 0;
    flickerSpeed = 1;

    backgroundGraphics = null;

    elapsedTime = 0;

    constructor (drawLayer, playerReference, position){
        const textStyle = new PIXI.TextStyle({
            fontFamily : "MicroCosmos",
            fontSize : 24,
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        const textContent = [
            ["The pit of hell needs no fuel for it burns for eternity\nYou are sinner, you must repent",
            "The road ahead is long but the kingdom requires it, do what you must\nNo cost is too great for freedom", 
            "We believe in you, DO IT DO IT DO IT DO IT DO IT DO IT \n DO IT DO IT DO IT DO IT DO IT DO IT DO IT DO IT \n DO IT DO IT DO IT DO IT DO IT "]];


        const randomSpriteIndex = Math.ceil(Math.random() * 10);
        super(drawLayer, playerReference, position, textStyle, textContent, "???", "MiniStatic" + randomSpriteIndex);



        //get a random phase and speed for the flickering animation
        this.flickerPhase= Math.random() * 3;
        this.flickerSpeed = Math.max(0.3, Math.random() * 3);

    }

    setupGraphics(){
        //make a pitch black background to this entity
        this.backgroundGraphics = new PIXI.Graphics();
        this.backgroundGraphics.beginFill("0x014d02");
        this.backgroundGraphics.drawRect(this.x - 16, this.y - 16, 32, 32);
        this.backgroundGraphics.endFill();
        this.drawLayer.addChild(this.backgroundGraphics);

        super.setupGraphics(2, 2);
        //this.sprite.tint = "0x00FF00";  

    }

    setupHitbox(){
        this.hitbox = new Rectangle(this.x - this.sprite.width/2 ,
                this.y - this.sprite.height/2 , this.sprite.width , this.sprite.height );

    }

    isInteracted(index){
        let monologue = super.isInteracted(index);

        monologue.setShakingException(0);
        monologue.setShakingException(1);
        monologue.setShakingException(2);


        return monologue;
    }

    idleUpdate(delta, inputs){
        this.elapsedTime += delta;

        this.sprite.alpha = Math.abs(Math.cos(this.flickerPhase + this.flickerSpeed * this.elapsedTime));


        this.setupHitbox();

    }
}

class SecretRock extends TextNpc{

    constructor(drawLayer, playerReference, position){
        const monologuesList =  [
            ["Congrats !!!!",
            "You found the secret rock !!!",
            "Your rewards is :",
            "Getting softlocked :)",
            "Don't interact with me again"], 
            ["You really think that the devs made more than one set \nof dialogue for a gimmick rock that no one's even gonna see ?",
            "Don't get your hopes up."],
            ["Mhm."],
            ["Mhm mhm."],
            ["Ok fine you win there's more dialogue... "],
            ["You're gonna have to press enter every single \ntime though :<)"],
            ["(It makes it more dramatic)"],
            ["(Just kidding, it would get really annoying)"],
            ["(One last one though)"],
            ["Anyways, what brings you here ?",
            "Did you get into hot waters with the mafia too ?",
            "Or perhaps did you use a clever framedrop to skip \nmost of the game ?   ",
            "Well.",
            "As you can see, there's isn't much here.",
            "Just me, you, and the endless void...",
            "Really, it's just you and the void.",
            "After all, I'm probably gonna run out of dialogue \nlines at some point.",
            "And only then will you understand the longing \nemptyness that's haunted me for so long.",
            "Uhhhh sorry I'm monologuing again.",
            "I kind of forgot the whole concept of ? \nconversations ?",
            "Being stranded alone for centuries \ndoes that to you.",
            "The story for this is actually pretty awkward",
            "You have to promise you won't laugh though, ok ?"],
            ["So picture this : I'm at a rock middle school, \nwith my rock friends",
            ", Doing rock things, ",
            "And, all of a sudden, something really bad \nhappens"],
            ["Sorry, I'm not really good with suspense.",
            "As I was saying, I was just hanging out in the \nrock recess until ",
            "THE WORST THING EVER HAPPENS !!!"],
            ["That was a little overexaggerated wasn't it ?",
            "I'm always super self-conscious about using exclamation \nmarks because what if it makes me look awkard, you know? ",
            "Also, using more than one exclamation mark \nmakes it come off ? sort of ironic.",
            "But really I'm super serious, and I wouldn't want \npeople misinterpreting that.",
            "I already had to force myself to use proper \ncapitalization and punctuation.",
            "I thought it was social anxiety at first, but \nthen I remembered :",
            "I'm a rock. What am I even afraid of ?",
            "And that's basically how my identity crisis \nstarted.",
            "Oh woops sorry I'm rambling again.",
            "Anyways, as I was saying we were really just \nchilling until ??? it happened"],
            ["I used the mid-sentence question mark thing \ndidn't I ?",
            "I hate myself so much.",
            "It's not funny. It's not interesting to read. And \nit just makes me look insecure.",
            "Sorry for dragging you into this, but, answer \nhonestly, do you think I sound annoying ?"],
            ["Aw that's nice of you, but it doesn't really mean \nmuch.",
            "I know that deep down, you still barely tolerate \nme...",
            "Worse actually, you probably hate me with every fiber of your \nbeing, and are only talking to me because i'm the only \n'distraction' here and you have nothing else to do",
            "Am I really just an npc in your life ?",
            "'Hahahah witty self-referential character' - \nis that all I mean to you ?",
            "Ah, to be sentient and part of the cool kids club...",
            "Though, I'm guessing that even you guys have \noutcasts to some extent..."],
            ["Oh, now you're interested ?",
            "Everything else was boring, but now, aaaaaall \nof a sudden, it's about 'you' so it must be important \nright ?",
            "Sorry I don't really like being mean even as a \njoke. ",
            "I hope I didn't make you feel bad......",
            "Am I apologizing too much ? If so, then sorry again. \nIs there anything I could do to make it up to you ?",
            "I guess you're looking for a way out ... just like \neveryone else here ... ?",
            "Hm, you're the first person to listen to me all the \nway through, I kind of owe you",
            "Talking with you was very relieving, you didn't \nmake fun of me, and you didn't judge me :) ",
            "Alright, don't tell anybody about it, but this \nshould help you clear the rest of the game"],
            ["This is just a rock.",
            "What did you expect ?"]
        ];

        const defaultTextStyle =  new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        super(drawLayer, playerReference, position, defaultTextStyle, monologuesList, "Rock", "Rock"  );


        this.defaultTextStyle = defaultTextStyle;
        this.smallTextStyle =  new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 20,
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        this.bigTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 32,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });



    }

    setupHitbox(){
        
        this.hitbox = new Rectangle(this.x - 10, this.y - 10, 20, 20);
    }

    isInteracted(index){
        let monologue = super.isInteracted(index);

        //set the text style exceptions that are necessary  
        if (index === 1){
            monologue.setTextStyleException(0, this.smallTextStyle);
        }
        else if (index === 12){
            console.log("the important one");
            monologue.setTextStyleException(1, this.smallTextStyle);

        }
        else if (index === 14){
            monologue.setTextStyleException(2, this.smallTextStyle);

        }
        else if (index === 15){
            monologue.setTextStyleException(1, this.smallTextStyle);
            monologue.setTextStyleException(4, this.smallTextStyle);

        }

        return monologue;
    }
}

class God extends TextNpc{

    isFading = false;

    constructor(drawLayer, playerReference, position, monologuesList){

        const textStyle = new PIXI.TextStyle({
            fontFamily : "Microcosmos",
            fontSize : 24,
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        super(drawLayer, playerReference, position, textStyle, monologuesList, "GOD",  "Sprites/WIP/ToCorrupt.png");
 
    }

    setupGraphics(){
        //asynchronously loads the god spritesheet
        //PIXI.Loader.shared.add("GodSpritesheet", "Sprites/God.json");

        //calls another instance method once the loading is done
        //const a =  PIXI.Loader.shared.load(() => this.setup(this));

        //get the spritesheet from the loader
        let sheet = PIXI.Loader.shared.resources["God Spritesheet"].spritesheet;


        //position the sprite correctly and add it to the container
        this.sprite =  new PIXI.AnimatedSprite(sheet.animations["Idle"]);
        this.sprite.play();
        this.drawLayer.addChild(this.sprite);
        this.sprite.x=  this.x - this.sprite.width / 2;
        this.sprite.y = this.y - this.sprite.height / 2;

    }

    setupHitbox(){
        this.hitbox = new Rectangle(this.x - 20, this.y - 30, 40, 60);
    }



    isInteracted(index){
        //only return a monologue if the npc hasn't started fading 
        if (! this.isFading){
            let monologue = super.isInteracted(index);
            let monologueIndex = Math.min(index, this.monologuesList.length - 1);

            //add a shake effect to every single voiceline by this character
            for (let i = 0; i < this.monologuesList[monologueIndex].length; i++){
                monologue.setShakingException(i);
            }

            return monologue;
        }
        else{
            return null;
        }
    }

    idleUpdate(delta, inputs){
        if (this.isFading){
            //reduces the alpha until it reaches zero
            this.sprite.alpha = Math.max(this.sprite.alpha - delta/2, 0);

            //destroys itself once it reaches zero alpha
            if (this.sprite.alpha === 0){
                this.destroy();
            }
            
        }

    }

    isInteractingJustDone(){
        super.isInteractingJustDone();
        this.isFading = true;
    }
}


class BossWarp extends Npc{


    isInteracted(){
        mainGame.changeScene(new SurferBoss(),  new PixelTransition(0.2, 0.2, 0x000000));
        return null;
    }

    setupHitbox(){
        this.hitbox = new Rectangle(this.x - 20, this.y - 20, 40, 40);
    }
}



class TutorialNpc extends Npc{

    isInteracted(){
        mainGame.changeScene(new TutorialBoss(), new PixelTransition(1, 1, 0x000000));
    }

    setupHitbox(){
        this.hitbox = new Rectangle(this.x - 20, this.y - 20, 40, 40);
    }
}

class PatternDebugNpc extends Npc{

    isInteracted(){
        mainGame.changeScene(new DexterityTest(50));
    }

    setupHitbox(){
        this.hitbox = new Rectangle(this.x - 20, this.y - 20, 40, 40);
    }
}