class TextNpc extends Npc{
    monologuesList =[]; //list of lists

    textStyle = undefined;
    name = "";

    spritePath = "";
    sprite = null;

    constructor(drawLayer, playerReference, position, textStyle, monologuesList, name, spritePath, detectionRadius=70){
        super(drawLayer, playerReference, position, detectionRadius);

        this.monologuesList = monologuesList;

        this.name = name;
        this.textStyle = textStyle;

        this.spritePath = spritePath;
    }

    setupGraphics(scaleX = 1, scaleY = 1){
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
        //if there are no monologues, just return null
        if (this.monologuesList.length === 0){
            return null;
        }

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


class Person extends TextNpc{
    // index of the current target point 
    currentIndex = 0;
    
    // the current target point 
    targetPoint = null;

    elapsedTime = 0;
    // The minimum y scale
    minScale = null;
    // Measures how fast the bobbing occurs
    bobbingPeriod = null;

    //the initial dimensions
    fullWidth = 10;
    fullHeight = 10;


    // How close the person gets to the target point before switching directions
    precisionEpsilon = null;

    
    constructor(drawLayer, playerReference, position, monologuesList, name, spritePath, targetPoints, speed=20, minScale=1.7, bobbingPeriod=1, precisionEpsilon=5){
            const textStyle = new PIXI.TextStyle({
                fontFamily : "BrokenConsole",
                fontSize : 24,
                fontWeight : "bold",
                fill : "#ffffff",
                stroke : "#ffffff",
            });
            super(drawLayer, playerReference, position, textStyle, monologuesList, name, spritePath, 
                70);

            // set up necessary variables 
            this.targetPoints = targetPoints;
            this.speed = speed;

            // We add the initial position to the target points so we can complete the loop
            this.targetPoints.push({...position});
            this.minScale = minScale;
            this.bobbingPeriod = Math.max(bobbingPeriod, 0.001);
            this.precisionEpsilon = precisionEpsilon;
        }


    
    setupGraphics(){
        super.setupGraphics(2, 2);

        //save the initial dimensions lol 
        this.fullWidth = this.sprite.width;
        this.fullHeight = this.sprite.height;
    }

    refreshGraphics(){
        this.sprite.x = this.x;
        this.sprite.y = this.y; 
    }

    setupHitbox(){
        this.hitbox = new Rectangle(this.x - this.fullWidth / 2, this.y - this.fullHeight / 2, this.fullWidth, this.fullHeight);
    }

    idleUpdate(delta, inputs){
        
        this.elapsedTime += delta;

        this.targetPoint = this.targetPoints[this.currentIndex];
        this.directionVector = new Vector(this.targetPoint.x - this.x, this.targetPoint.y - this.y);


        // if the person if close enough to the current target, switch targets 
        if (this.directionVector.getNorm() <= this.precisionEpsilon){
            this.currentIndex = (this.currentIndex + 1) % this.targetPoints.length;
        }

        else{
            // Move the npc toward the target with the given speed 
            this.directionVector = this.directionVector.normalize().rescale(this.speed);

            // Also keep track of the center position to setup the hitbox later 
            this.x += this.directionVector.x * delta;
            this.y += this.directionVector.y * delta;

            this.refreshGraphics();
        }


        // Make the sprite bob up and down with the specified period and minScale
        this.sprite.scale.y = this.minScale + Math.abs((2 - this.minScale) * Math.cos(this.elapsedTime * Math.PI / this.bobbingPeriod));
        this.sprite.y = this.y + 32 * (1 - this.sprite.scale.y);
        
        
        // We reset the timer purely for performance reasons not to have a large number to evaluate each time
        if (this.sprite.scale.y >= 1.97 && this.elapsedTime >= 1000){
            this.elapsedTime = 0;
        }

        if (this.directionVector.x != 0){
            // change the orientation of the sprite depending on the xDirection 
            this.sprite.scale.x = -2 * Math.sign(this.directionVector.x);
            // Adjust the x of the sprite since the way it is drawn depends on the scale
            this.sprite.x = this.x - Math.sign(this.sprite.scale.x) * this.sprite.width / 2
        }

        //
        this.setupHitbox();
         


    }
}



// a simple background tile that takes a sprite as an argument
class Tile extends Npc{
    spriteName = "";
    sprite = null;

    scaleX = 1;
    scaleY = 1;

    constructor(drawLayer, playerReference, position, spriteName, scale = {x:1,y:1}){
        super(drawLayer, playerReference, position, 0);

        this.spriteName = spriteName;
        this.scaleX = scale.x;
        this.scaleY = scale.y;        
    }

    setupGraphics(){
        this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[this.spriteName].texture);
        this.drawLayer.addChild(this.sprite);

        this.sprite.scale.x = this.scaleX;
        this.sprite.scale.y = this.scaleY;

        this.sprite.x = this.x - this.sprite.width /2;
        this.sprite.y = this.y - this.sprite.height / 2;
    }
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

    setupGraphics(){
        super.setupGraphics(2, 2);
    }


    setupHitbox(){
        
        this.hitbox = new Rectangle(this.x - this.sprite.width / 2, this.y - this.sprite.height / 2, this.sprite.width, this.sprite.height);
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
        this.backgroundGraphics.beginFill("0x000000");
        this.backgroundGraphics.drawRect(this.x - 16, this.y - 16, 32, 32);
        this.backgroundGraphics.endFill();
        this.drawLayer.addChild(this.backgroundGraphics);

        super.setupGraphics(2, 2);
        this.sprite.tint = "0x55FF55";  

        this.sprite.alpha = 0;

    }

    setupHitbox(){
        // this.hitbox = new Rectangle(this.x - this.sprite.width/2 ,
        //         this.y - this.sprite.height/2 , this.sprite.width , this.sprite.height );

    }

    isInteracted(index){
        let monologue = super.isInteracted(index);

        monologue.setShakingException(0);
        monologue.setShakingException(1);
        monologue.setShakingException(2);


        return monologue;
    }

    idleUpdate(delta, inputs){
        // this.elapsedTime += delta;

        // this.sprite.alpha = Math.abs(Math.cos(this.flickerPhase + this.flickerSpeed * this.elapsedTime));


        // this.setupHitbox();

    }
}

class BlackHole extends TextNpc{

    scale = 1; //default size

    constructor(drawLayer, playerReference, position){
        //call the constructor just to set up basic position stuff
        super(drawLayer, playerReference, position, undefined, [], "???", "Cross");

        //randomize the size of the hole 
        this.scale = Math.random() * 2;
    }


    setupGraphics(){
        //just display the sprite pwease
        super.setupGraphics(this.scale, this.scale);

    }
}

class FlickeringBit extends TextNpc{

    textDisplay = null;

    currentNumber = 1;
    flickerCooldown = 2;
    currentFlickerTimer = 0;

    graphicsTextStyle = null;

    constructor(drawLayer, playerReference, position, scale){


        const dialogueTextStyle =  new PIXI.TextStyle(
            {
                fontFamily : "BrokenConsole",
                fontSize : 30,
                fill : "#2DEC1F",
            }
        );


        super(drawLayer, playerReference, position, dialogueTextStyle, [[""]], "???", "");

        //generate the level of green at random between 150 and 255
        const greenLevel = Math.floor(Math.random() * 100) + 150;
        const hexGreenLevel = greenLevel.toString(16);

        //font solely for displaying the actual bit 
        this.graphicsTextStyle = new PIXI.TextStyle(
            {
                fontFamily : "BrokenConsole",
                fontSize : 50 * scale,
                fontWeight : "bold",
                fill : "0x00" + hexGreenLevel + "00",
            }
        );

        //find a random flicker cooldown and starting phase
        this.flickerCooldown = Math.max(0.2, Math.random() * 2);
        this.currentFlickerTimer = Math.random() * this.flickerCooldown;
    }

    //override setup graphics to make this entity represented by a text box
    setupGraphics(){
        //draw a text box centered around the given position
        this.textDisplay = new TextDisplay(this.drawLayer, this.currentNumber + "", {x:0,y:0}, this.graphicsTextStyle);
        this.textDisplay.centerHorizontallyAt(this.x);
        this.textDisplay.centerVerticallyAt(this.y);

    }

    setupHitbox(){
        this.hitbox = new Rectangle(this.textDisplay.getPosition().x, this.textDisplay.getPosition().y, 
            this.textDisplay.getDimensions().width, this.textDisplay.getDimensions().height - this.graphicsTextStyle.fontSize / 5);
    }


    idleUpdate(delta, inputs){
        this.currentFlickerTimer += delta;

        if (this.currentFlickerTimer >= this.flickerCooldown){
            this.currentFlickerTimer = 0;

            //change the current number
            this.currentNumber = (this.currentNumber + 1) % 2;

            //change the displayed text
            this.textDisplay.setText(this.currentNumber + "");
            this.textDisplay.centerHorizontallyAt(this.x);
            this.textDisplay.centerVerticallyAt(this.y);
        }
    }

    isInteracted(index){
        let sequences = [];
        let sequencesCount = Math.ceil(Math.random() * 2);
        


        for (let i = 0; i < sequencesCount; i ++){
            let length = Math.floor(Math.random() * 40);
            sequences.push("");

            for (let j = 0; j < length; j ++ ){
                sequences[i] += Math.floor(Math.random() * 2);

            }
        }

        console.log(sequences);

        let monologue = super.isInteracted(index);
        monologue.setTextContent([sequences.join("\n")]);

        return monologue;
    }
}

class MissingTexture extends TextNpc{

    displayTextStyle = null;
    textDisplay = null;

    borderGraphics = null;

    constructor(drawLayer, playerReference, position){
        
        //call the constructor just to set up basic position stuff
        super(drawLayer, playerReference, position, undefined, [], "???", "");

        this.displayTextStyle = new PIXI.TextStyle(
            {
                fontFamily : "Calibri",
                fontSize : 20,
                fontStyle: "italic",
                fontWeight : "bold",
                fill : "0xf445f7",
            }
        );
    }


    setupGraphics(){
        this.textDisplay = new TextDisplay(this.drawLayer, "Missing\nTexture", {x:0, y:0}, this.displayTextStyle);

        //center it at the proper coordinates
        this.textDisplay.centerHorizontallyAt(this.x);
        this.textDisplay.centerVerticallyAt(this.y);

        //create a little magenta border around it too
        this.borderGraphics = new PIXI.Graphics();
        this.borderGraphics.lineStyle(2, "0xf445f7", 1);
        this.borderGraphics.drawRect(this.textDisplay.getPosition().x, this.textDisplay.getPosition().y,
            this.textDisplay.getDimensions().width, this.textDisplay.getDimensions().height);
        this.drawLayer.addChild(this.borderGraphics);
    }

    setupHitbox(){

        this.hitbox = new Rectangle(this.textDisplay.getPosition().x, this.textDisplay.getPosition().y,
            this.textDisplay.getDimensions().width, this.textDisplay.getDimensions().height);
    }

    moveBy(movementVector){
        this.textDisplay.textEntity.x += movementVector.x;
        this.textDisplay.textEntity.y  += movementVector.y;

        this.borderGraphics.x += movementVector.x;
        this.borderGraphics.y += movementVector.y;

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
    automaticDetectionRadius = 50;


    constructor(drawLayer, playerReference, position){

        const textStyle = new PIXI.TextStyle({
            fontFamily : "Precious",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#ffffff",
        });

        const monologuesList = [
            [
                "Be not afraid, my child.",
                "You must be the heavenly vessel I asked for.",
                "To the limit of your abilities, you shall spring forth and rescue this world.",
                "You are our last hope at salvation.",
                "I trust my words will make sense in due time.",
                "And if they do not, we will simply try again...",
                "Be free, and make your own decisions, young one.",
                "Peace,",
                "G.O.D" 

            ]

        ];

        super(drawLayer, playerReference, position, textStyle, monologuesList, "????",  "");
 
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
        if (!this.isFading){
            return super.isInteracted(index);
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
        else{
            //automatically detect the player for the first in game interaction
            const distance =  new Vector(this.playerReference.x - this.x, this.playerReference.y - this.y);
            
            if (distance.getNorm() <= this.automaticDetectionRadius){
                this.startNewInteraction();
            }
        }


        

    }

    isInteractingJustDone(){
        super.isInteractingJustDone();
        this.isFading = true;

        //start the fadeout of the entire scene lol 
        mainGame.changeScene(new IntroOutsideScene(), new FadeTransition(3, 2, 4));

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



class TutorialNpc extends Person{

    isInteractingJustDone(){
        mainGame.changeScene(new TutorialBoss(), new PixelTransition(1, 1, 0x000000));
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

class Bar extends Npc{

    constructor(drawLayer, playerReference, position, detectionRadius=110){
        
        super(drawLayer, playerReference, position, detectionRadius);
        this.spritePath = 'Bar';
    }
    isInteracted(){
        mainGame.changeScene(new BarScene());
    }

    setupGraphics(){
        this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[this.spritePath].texture);
        this.drawLayer.addChild(this.sprite);

        this.sprite.x = this.x - this.sprite.width / 2;
        this.sprite.y = this.y - this.sprite.height / 2;


    }
    
    setupHitbox(){
        this.hitbox = new Rectangle(this.x - this.sprite.width/ 2, this.y - this.sprite.height / 2, this.sprite.width, this.sprite.height);

    }
    
}

class SignPost extends TextNpc{

    constructor(drawLayer, playerReference, position, monologuesList){

        const textStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        super(drawLayer, playerReference, position, textStyle, monologuesList, 'Street Sign', 'Sign', 85);
 
    }

    setupGraphics(){
        super.setupGraphics(2, 2);
    }

    setupHitbox(){
        
        this.hitbox = new Rectangle(this.x - this.sprite.width /2, this.y - this.sprite.height/2, this.sprite.width, this.sprite.height);
    }
};


class Tree extends TextNpc{
    constructor(drawLayer, playerReference, position, monologuesList){

        const textStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#ffffff",
        });


        super(drawLayer, playerReference, position, textStyle, monologuesList, 'Tree', 'Tree', 85);
 
    }

    setupGraphics(){
        super.setupGraphics(2, 2);
    }


    setupHitbox(){
        
        this.hitbox = new Rectangle(this.x - this.sprite.width/2, this.y - this.sprite.height/2, this.sprite.width, this.sprite.height);
    }
}

class Chair extends TextNpc{

    constructor(drawLayer, playerReference, position, monologuesList){
        const textStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#00ff00",
            stroke : "#00ff00",
        });

        super(drawLayer, playerReference, position, textStyle, monologuesList, 'Chair', 'Chair', 85);
 
    }

    setupGraphics(){
        super.setupGraphics(2, 2);
    }


    setupHitbox(){
        
        this.hitbox = new Rectangle(this.x - this.sprite.width/2, this.y - this.sprite.height/2, this.sprite.width, this.sprite.height);
    }
}


class LightAura extends Npc{

    shadeObject = null;
    shadeContainer = null;

    maxShadeAlpha = 0.1;


    radius = 0;

    shadeCount = 0;

    constructor(playerReference, position, shadeObject, shadeContainer, radius, shadeCount ){

        super(drawLayers.foregroundLayer, playerReference, position);   


        this.shadeObject = shadeObject;
        this.shadeContainer = shadeContainer;

        this.radius = radius;
        this.shadeCount = shadeCount;
        
        
    }

    //make the required amount of shade circles around the target position
    setupGraphics(){
        let currentOuter = this.shadeObject;
        this.maxShadeAlpha = this.shadeObject.alpha
        
        for (let i = 0; i < this.shadeCount; i ++){
            
            let newInner = new PIXI.Graphics();
            
            this.cutHoleAndShade(currentOuter, newInner, 
                             this.radius * (this.shadeCount - i)/ this.shadeCount, 
                             this.maxShadeAlpha * (1 - (i + 1) / this.shadeCount), {x:this.x, y:this.y});
            this.shadeContainer.addChild(newInner);
            
            currentOuter = newInner;
        };
    }

    
    cutHoleAndShade(outerShade, innerShade, shadeRadius, shadeAlpha, position){
        // cuts a hole in the outerShade with the radius and fills the gap with the innerShade with the specified alpha
        // at the given position. We can't just use the lightSource center since the innershades are in a differentcontainer
        outerShade.beginHole();
        outerShade.drawCircle(position.x, position.y, shadeRadius);
        outerShade.endHole();

        innerShade.beginFill(0x000000);
        innerShade.drawCircle(position.x, position.y, shadeRadius);
        innerShade.endFill();
        innerShade.alpha = shadeAlpha;
    }
}


class LightSource extends TextNpc{
    
    currentMax = null;
    
    elapsedTime = 0;
    staticTimer = 0;
    flickerTimer = 0;
    
    maxShadeAlpha = null;
    
    fixedShade = new PIXI.Graphics();
    shades = [];

    constructor(shadeObject, shadeContainer, drawLayer, monologueList, playerReference, position, spritePath, maxRadius=50, minRadius=1, shadeCount=3, flickerPeriod=1, staticPeriod=5,
        soundIntensity=100){

        const textStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#ffff00",
            stroke : "#ffff00",
        });

        super(drawLayer, playerReference, position, textStyle, monologueList, 'Light', spritePath);
        // set up necessary variables 
        this.spritePath = spritePath;
        this.shadeObject = shadeObject;
        
        this.maxShadeAlpha = this.shadeObject.alpha;
        
        this.shadeContainer = shadeContainer;
        this.shadeCount = shadeCount;

        this.maxRadius = maxRadius;
        this.minRadius = minRadius;

        this.flickerPeriod = Math.max(flickerPeriod, 0.001);
        this.staticPeriod = staticPeriod;
        this.w = Math.PI * 2 / this.flickerPeriod;

        this.soundIntensity = soundIntensity * 10;
        PIXI.sound.add('BrokenLight', './././Sound/brokenlight.wav')
        this.generateShades();
    };

    setupGraphics(){
        super.setupGraphics(2, 2);
    }


    

    generateShades(){
        // Generate the shades used to resemble a light source. We cut a hole in the scene's shade and draw
        // our own shades in that hole. We put the shades in a new container whose scale and position
        // we later change

        // Container for the inner (non-fixed) shades
        this.innerShadesContainer = new PIXI.Container();
        // cut hole and draw the fixed shade
        this.cutHoleAndShade(this.shadeObject, this.fixedShade, this.maxRadius, this.maxShadeAlpha, {x:this.x, y:this.y});
        this.shadeContainer.addChild(this.fixedShade);
        
        // Recursively apply cutHoleAndShade to draw the concentric circles. 
        let currentOuter = this.fixedShade;
        
        for (let i = 0; i < this.shadeCount; i ++){
            
            let newInner = new PIXI.Graphics();
            
            this.cutHoleAndShade(currentOuter, newInner, 
                             this.maxRadius * (this.shadeCount - i)/ this.shadeCount, 
                             this.maxShadeAlpha * (1 - (i + 1) / this.shadeCount), {x:this.maxRadius, y:this.maxRadius});
            this.innerShadesContainer.addChild(newInner);
            
            currentOuter = newInner;
        };

        // Finally, add the innercontainer to the shadecontainer and set its position
        this.shadeContainer.addChild(this.innerShadesContainer);
        this.innerShadesContainer.x = this.x - this.maxRadius;
        this.innerShadesContainer.y = this.y - this.maxRadius;
    }
    
    playSound(){
        // play sound at a volume calculated from the distance to the player 
        this.playerToLightVector = new Vector(this.x - this.playerReference.x, this.y - this.playerReference.y);

        let distance = this.playerToLightVector.getNorm();
        let volume = 2 * this.soundIntensity / ( 4 * Math.PI *(distance) ** 2)

        //clamp the volume so it's never too low or too loud
        volume = Math.max(volume, 0.02);
        volume = Math.min(volume, 0.1);

        PIXI.sound.volume('BrokenLight', volume);
        PIXI.sound.play('BrokenLight')
    }

    setupGraphics(){
        // set up the sprite 
        super.setupGraphics(2, 2);
    };

    setupHitbox(){
        // set up hitbox 
        const width = this.sprite.width;
        const height = this.sprite.height;
        this.hitbox = new Rectangle(this.x - width / 2, this.y - height /2, width, height)
    }

    cutHoleAndShade(outerShade, innerShade, shadeRadius, shadeAlpha, position){
        // cuts a hole in the outerShade with the radius and fills the gap with the innerShade with the specified alpha
        // at the given position. We can't just use the lightSource center since the innershades are in a differentcontainer
        outerShade.beginHole();
        outerShade.drawCircle(position.x, position.y, shadeRadius);
        outerShade.endHole();

        innerShade.beginFill(0x000000);
        innerShade.drawCircle(position.x, position.y, shadeRadius);
        innerShade.endFill();
        innerShade.alpha = shadeAlpha;
    }

    resetFixedShade(){
        // called every Update. We need this because we can't put the fixed shade in the inner shade container
        // If we did, it will shrink with the rest and we are left with an unfilled gap in the outer (the scene's) shade
        this.fixedShade.clear();
        this.fixedShade.beginFill(0x000000);
        this.fixedShade.drawCircle(this.x, this.y, this.maxRadius);
        this.fixedShade.endFill();

        this.fixedShade.beginHole();
        this.fixedShade.drawCircle(this.x, this.y, this.currentMax);
        this.fixedShade.endHole();   
    }

    update(delta, inputs){
       
        super.update(delta, inputs);
        
        if (this.staticTimer <= this.staticPeriod){
            // this is the static phase, no changes to the radii
            this.staticTimer += delta;
            this.currentMax = this.maxRadius;
        }

        else{
            // if static phase is over... 
            if (this.flickerTimer === 0){
                // if flicker is just starting, play the sound
                this.playSound();
            }
            this.flickerTimer += delta;
            this.currentMax = this.minRadius + Math.abs((this.maxRadius - this.minRadius) * Math.cos(this.flickerTimer * this.w / 2));
            if (this.flickerTimer >= this.flickerPeriod){
                // if flicker is finished, go back to the static phase
                this.flickerTimer = 0;
                this.staticTimer = 0;
            }
        }
        
        this.elapsedTime += delta;

        // Tint the Sprite based on the following ratio which also represents the brightness of the light source
        let ratio = this.currentMax / this.maxRadius;
        let num = Math.floor(ratio * 15);
        
        let tint = 0;
        for (let i = 0; i < 6; i++){
            tint += num * (16 ** i)
        }

        this.sprite.tint = tint;
        
       // redraw the fixed shade
        this.resetFixedShade();

        // Adjust the inner container's scale and position to give the appearance of shrinking 
        this.innerShadesContainer.scale.x = ratio;
        this.innerShadesContainer.scale.y = ratio;
        
        this.innerShadesContainer.x = this.x - this.currentMax;
        this.innerShadesContainer.y = this.y - this.currentMax;
        
        

    }

}