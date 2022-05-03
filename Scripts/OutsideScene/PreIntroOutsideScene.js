class PreIntroOutsideScene extends OutsideScene{
    requiredAssets = {
        "God Spritesheet": "Sprites/God.json",
        "Rock": "Sprites/Rock.png",
        "Shield":  "Sprites/Shield.png",
        "Static" : "Sprites/Static.png",
        "Cross" : "Sprites/Cross.png",
        "MiniStatic1" : "Sprites/MiniStatics/MiniStatic.png",
        "MiniStatic2" : "Sprites/MiniStatics/MiniStatic2.png",
        "MiniStatic3" : "Sprites/MiniStatics/MiniStatic3.png",
        "MiniStatic4" : "Sprites/MiniStatics/MiniStatic4.png",
        "MiniStatic5" : "Sprites/MiniStatics/MiniStatic5.png",
        "MiniStatic6" : "Sprites/MiniStatics/MiniStatic6.png",
        "MiniStatic7" : "Sprites/MiniStatics/MiniStatic7.png",
        "MiniStatic8" : "Sprites/MiniStatics/MiniStatic8.png",
        "MiniStatic9" : "Sprites/MiniStatics/MiniStatic9.png",
        "MiniStatic10" : "Sprites/MiniStatics/MiniStatic10.png",
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

    //for the decoration npcs
    bitCount = 200; //upper bound btw not accurate number
    staticCount = 50; //upper bound too

    usedPositions = [[384, 284], [416, 284], [400, 300], [384, 316], [416, 316]]; // contains only a few player points at first (to prevent anything from spawing ON the player)



    constructor(){
        super("0x014d02");

    }


    load(){
        super.load();

        //set the map shape
        this.setMapMatrix([[2, 1, 1, 1, 1, 1, 1]]);


        //create a trippy background for the entire scene
        this.background = new PIXI.Sprite(PIXI.Loader.shared.resources["Static"].texture)
        this.background.scale.x = 8;
        this.background.scale.y = 8;

        this.background.alpha = 0.5;
        this.background.tint = "0x014d02";

        drawLayers.backgroundLayer.addChild(this.background);


        // //create a few random crosses in the scene using the same logic 
        // for (let i =0; i < this.staticCount; i++){
        //     let randomX = Math.random() * 5000;
        //     let randomY = Math.random() * 600;

        //     //go through every single previous position to not be too close to it
        //     let flag = false; 
        //     for (let usedPosition of this.usedPositions){
        //         let distance = Math.sqrt(Math.pow(usedPosition[0] - randomX, 2) + Math.pow(usedPosition[1] - randomY, 2));
        //         if (distance <= 40){
        //             flag = true;
        //         }
        //     }

        //     if (flag){
        //         continue;
        //     }



        //     this.npcList.push(new BlackHole(this.container, this.playerReference, {x:randomX, y:randomY}));
            
        //     //keep track of this used position
        //     this.usedPositions.push([randomX, randomY]);
        // }

        //create a few random bits in the scene
        for (let i =0; i < this.bitCount; i++){
            let randomX = Math.random() * 5000;
            let randomY = Math.random() * 600;

            let randomScale= Math.max(0.5, Math.random() * 2)


            //go through every single previous position to not be too close to it
            let flag = false; 
            for (let usedPosition of this.usedPositions){
                let distance = Math.sqrt(Math.pow(usedPosition[0] - randomX, 2) + Math.pow(usedPosition[1] - randomY, 2));
                if (distance <= 40 * randomScale){
                    flag = true;
                }
            }

            if (flag){
                continue;
            }



            this.npcList.push(new FlickeringBit(this.container, this.playerReference, [["AAA"]], {x:randomX, y:randomY}, randomScale));
            
            //keep track of this used position
            this.usedPositions.push([randomX, randomY]);
        }




        //create some missing texture entities
        this.npcList.push(new MissingTexture(this.container, this.playerReference, {x:100, y:100}));
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