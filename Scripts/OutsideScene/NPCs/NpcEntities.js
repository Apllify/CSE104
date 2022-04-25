class TextNpc extends Npc{
    monologuesList =[]; //list of lists
    currentMonologueIndex = 0;

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

    setupGraphics(){
        //assumes the sprite has already been loaded
        this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[this.spritePath].texture);
        this.drawLayer.addChild(this.sprite);

        this.sprite.x = this.x - this.sprite.width / 2;
        this.sprite.y = this.y - this.sprite.height / 2;

        //this.sprite = PIXI.Sprite.from(this.spritePath);
        //this.drawLayer.addChild(this.sprite);

        //this.sprite.x = this.x - this.sprite.width / 2;
        //this.sprite.y = this.y - this.sprite.height / 2;

    }



    destroyGraphics(){
        this.sprite.destroy();
    }

    //returns an element of type monologue
    isInteracted(){
        //prevent the player from moving 
        this.playerReference.pause();


        //advance the monologue by one if possible
        this.currentMonologueIndex = Math.min(this.currentMonologueIndex + 1, this.monologuesList.length - 1);

        //determin the vertical offset based on the player position
        const verticalOffset= (this.playerReference.y > 300) ? 0 : 1;


        return new Monologue(drawLayers.foregroundLayer, this.monologuesList[this.currentMonologueIndex], this.textStyle,
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



    isInteracted(){
        //only return a monologue if the npc hasn't started fading 
        if (! this.isFading){
            return super.isInteracted();
        }
        else{
            return null;
        }
    }

    idleUpdate(delta, inputs){
        if (this.isFading){
            //reduces the alpha until it reaches zero
            this.sprite.alpha -= delta/2;

            //destroys itself once it reaches zero alpha
            //this.destroy();
        }

    }

    isInteractingJustDone(){
        super.isInteractingJustDone();
        this.isFading = true;
    }
}


class BossWarp extends Npc{


    isInteracted(){
        mainGame.changeScene(new SurferBoss());
        return null;
    }

    setupHitbox(){
        this.hitbox = new Rectangle(this.x - 20, this.y - 20, 40, 40);
    }
}



