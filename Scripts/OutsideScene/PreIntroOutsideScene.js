class PreIntroOutsideScene extends OutsideScene{
    requiredAssets = {
        "God Spritesheet": "Sprites/God.json",
        "Rock": "Sprites/Rock.png",
        "Shield":  "Sprites/Shield.png",
        "Static" : "Sprites/Static.png",
        "MiniStatic1" :"Sprites/MiniStatics/MiniStatic.png",
        "MiniStatic2" :"Sprites/MiniStatics/MiniStatic2.png",
        "MiniStatic3" :"Sprites/MiniStatics/MiniStatic3.png",
        "MiniStatic4" :"Sprites/MiniStatics/MiniStatic4.png",
        "MiniStatic5" :"Sprites/MiniStatics/MiniStatic5.png",
        "MiniStatic6" :"Sprites/MiniStatics/MiniStatic6.png",
        "MiniStatic7" :"Sprites/MiniStatics/MiniStatic7.png",
        "MiniStatic8" :"Sprites/MiniStatics/MiniStatic8.png",
        "MiniStatic9" :"Sprites/MiniStatics/MiniStatic9.png",
        "MiniStatic10" :"Sprites/MiniStatics/MiniStatic10.png"


    };

    elapsedTime = 0;


    //for the weird moving background
    background = null;

    xBackgroundSpeed = 3;
    yBackgroundSpeed = 2;
    backgroundAmplitude = 100;

    //for the overall screen shake
    shakeAmplitude = 10; //how intense the screen shake is
    xShakeSpeed = 10;
    yShakeSpeed = 14;

    //for the name replacement meme
    specialCharacters = ["$", "&", "!",  "%",  ">", "=", "6", "7", "9"];
    characterCooldown = 0.05;
    currentCharacterTimer = 0;

    //for the rock npcs
    rockCount = 300;



    constructor(){
        super("0x014d02");

    }


    load(){
        super.load();

        //set the map shape
        this.setMapMatrix([[2, 1, 1, 1, 1]]);


        //create a trippy background for the entire scene
        this.background = new PIXI.Sprite(PIXI.Loader.shared.resources["Static"].texture)
        this.background.scale.x = 8;
        this.background.scale.y = 8;

        this.background.alpha = 0.5;
        this.background.tint = "0x014d02";

        drawLayers.backgroundLayer.addChild(this.background);


        //create a few random rocks in the scene
        for (let i =0; i < this.rockCount; i++){
            let randomX = Math.random() * 4000;
            let randomY = Math.random() * 600;
            this.npcList.push(new MiniStatic(this.container, this.playerReference, {x:randomX, y:randomY}));
        }
    }



    update(delta, inputs){
        //call the super method 
        super.update(delta, inputs);

        //increment the important timer 
        this.elapsedTime += delta;



        //shake the entire game window (seizure inducing lol)
        app.view.style.left = ((window.innerWidth - 800)*0.5 + Math.cos(this.xShakeSpeed * this.elapsedTime) * this.shakeAmplitude)   + "px";
        app.view.style.top = ((window.innerHeight - 600)*0.5 + Math.sin(this.yShakeSpeed * this.elapsedTime) * this.shakeAmplitude)   + "px";


        //slightly move the static foreground
        //this.foreground.alpha =  Math.abs(Math.cos(2.5 * this.elapsedTime)) / 4;
        this.background.x = -500 + this.backgroundAmplitude * Math.cos(this.xBackgroundSpeed * this.elapsedTime);
        this.background.y = -200 + this.backgroundAmplitude * Math.cos(this.yBackgroundSpeed * this.elapsedTime);

        //alter random characters from the player name 
        this.currentCharacterTimer += delta;

        if (this.currentCharacterTimer >= this.characterCooldown){
            this.currentCharacterTimer = 0;

            //get a random character and random index to replace with it 
            const randomChar = this.specialCharacters[Math.floor(Math.random() * this.specialCharacters.length)];
            const randomIndex = Math.floor(Math.random() * this.playerReference.healthBar.playerName.length);
            const currentName = this.playerReference.healthBar.nameTag.getText();

            let newName = currentName.substring(0, randomIndex) + randomChar + currentName.substring(randomIndex + 1);

            this.playerReference.healthBar.nameTag.setText(newName);
        }


    }
}