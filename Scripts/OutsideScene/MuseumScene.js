class MuseumScene extends OutsideScene{

    //load almost every single asset in the game for showcase purposes
    requiredAssets = {
        'Shield':  'Sprites/Shield.png',
        "Chair": "Sprites/Chair.png",
        "Table": "Sprites/Table.png",
        "Wood1": "Sprites/Tiles/Wood1.png",
        "Wood2": "Sprites/Tiles/Wood2.png",
        "Wood3": "Sprites/Tiles/Wood3.png",
        'Tutorial': "Sprites/Npc/Npc10.png",
        'TrapDoorOpen': 'Sprites/TrapDoorOpen.png',
        'TrapDoorClosed': 'Sprites/TrapDoorClosed.png',
        'BarExit': 'Sprites/BarExit.png',
        'Npc1' : 'Sprites/Npc/Npc1.png',
        'Npc2' : 'Sprites/Npc/Npc2.png',
        'Npc3' : 'Sprites/Npc/Npc3.png',
        'Npc4' : 'Sprites/Npc/Npc4.png',
        'Npc5' : 'Sprites/Npc/Npc5.png',
        'Npc6' : 'Sprites/Npc/Npc6.png',
        'Npc7' : 'Sprites/Npc/Npc7.png',
        'Npc8' : 'Sprites/Npc/Npc8.png',
        'Npc9' : 'Sprites/Npc/Npc9.png',
        'Vomit': 'Sprites/Npc/Vomit.png',
        "God Spritesheet": "Sprites/God.json",
        "Rock": "Sprites/Rock.png",
        "Shield":  "Sprites/Shield.png",
        "Sign": "Sprites/Sign.png",

        "Source": "Sprites/Source.jpg"
    }

    mapLength = 10;
    totalWidth = 0;

    elapsedTime = 0;
    bgMoveAmplitude = 100;
    bgMoveSpeed = 0.3;


    signSpacing = 500;
    cageWidth = 300;
    cageBorderWidth = 5;

    backgrounds = [];
    backgroundsCoords = [];

    cageEntities = [];
    cageExceptions = [1, 2, 3]; //the index of cages that can be entered through.
    cageOpeningSize = 60; //the size of the openings for cage exceptions

    shade = null;
    shadeAlpha = 0.8;


    constructor(){
        super(0xFFFFFF);
    }

    load(){
        super.load();

        //set the player at the veeery start of the room
        this.playerReference.x = 100;
        




        //get the total screen width and generate the rooms 
        this.totalWidth = this.mapLength * 800;
        let mapMatrix = [2];

        for (let i = 0; i < this.mapLength - 1; i ++){
            mapMatrix.push(1);
        }

        this.setMapMatrix([mapMatrix]);

        //create as many background textures as it takes to fill the entire background
        const backgroundTexture = PIXI.Loader.shared.resources["Source"].texture;


        for (let x = 0; x < this.totalWidth; x+= backgroundTexture.width){
            //create two sprites (one top, one bottom)
            for (let y = 0; y < 600; y += backgroundTexture.height){
                let backgroundSprite = new PIXI.Sprite(backgroundTexture);

                backgroundSprite.x = x;
                backgroundSprite.y = y;
                backgroundSprite.alpha = 0.4;

                this.backgroundContainer.addChild(backgroundSprite);
                this.backgrounds.push(backgroundSprite);

                //also keep track of the starting coords of this sprite
                this.backgroundsCoords.push({x:x, y:y});
            }


        }

        //create a shade alpha on top of the light aura cage
        this.shade =  new PIXI.Graphics();
        this.shade.beginFill(0x000000);
        this.shade.drawRect( this.signSpacing * 4 + 100, 0, this.cageWidth, 200);
        this.shade.endFill();
        this.shade.alpha = this.shadeAlpha;
        


        this.foregroundContainer.addChild(this.shade);
        

        const signDialogues = [
            [["Enclosed here is our very first creation : ",
            "You.",
            "Surprinsingly, even though we expected the \ncodebase for it to become very large very fast,",
            "It actually turned out to be rather concise at \na final 229 lines including line breaks.",
            "The main logic for it is pretty intuitive : ",
            "Every frame, it checks for 'w,a,s,d' inputs, and \nuses that to form a direction vector for that frame.",
            "The vector is of the form (-1/0/1, -1/0/1) and is \nnormalized before being used.",
            "We then only need to multiply the vector by the \ncharacter speed and the delta frame value,",
            "In order to obtain the movement vector of the \nplayer.",
            "As for the rest of the file, it's mainly comrprised \nof auxiliary methods.",
            "An example would be setPosition() which helps \nencapsulate the behavior of warping the player.",
            "While you're reading this sign, your main \ncharacter is paused using another such method.",
            "As a result of that, only the character on \nthe right is controlled by your inputs.",
            "Look at him go."]],


            [[
                "So this might look like a simple rock.",
                "And it is.",
                "But what makes it interesting is that it was the \nsecond sprite we made.",
                "If you find that interesting ? Maybe ?",
                "It introduced us to collision checking, and we \ndecided to compromise : ",
                "Since this is a very elementary framework meant \nfor web developement,",
                "We decided it would be best to keep collisions as \nstripped down as possible,",
                "As such, most entities have a very simple \nrectangular hitbox,",
                "Which, in turn, allows us to detect collisions in \nless than 4 lines.",
                "Now, unfortunately, the process of actually \nfixing the collision is much more complex.",
                "We opted for the following :",
                "1°)Draw a vector connecting the current player \nposition and last frame's position",
                "2°)Sliding the player from the previous position to \nthe current one to find the 'tipping point'",
                "That is, the point where the player goes from no \ncollision to yes collision",
                "3°) Placing the player right before that tipping \npoint.",
                "This system is very very rudimentary, but it is \nenough in the case of our simple rpg."
            ]],

            [[
                "It looks kind of weird, but I suppose we should \nalso talk about signs.",
                "In reality, making the signs themselves wasn't \ntoo difficult.",
                "But instead, most of our time was spent working \nout the dialogue system.",
                "Or, as we call internally, the monologue system. \nPretty cool right ?",
                "Oh sorry I forgot, you can't answer me.",
                "In order to maximize readability and contrast, \nwe went for a large black square,",
                "Surrounded by a thin white border.",
                "The system accomodates for most fonts that we \nimported, and allows for cool text effects,",
                "The most notable example being the mysterious \nnpc in the very first game scene.",
                "The collision system is, again, a rectangle,",
                "And that becomes pretty obvious if you try to \ngrind against the object.",
                "This entity was honestly a life-saver \ncontent-wise for the game.",
                "It allowed us to add so much more depth, without \nbreaking the immersion."

            ]],
            
            [[
                "This is the PIXI js ((lighting)) ((system)).",
                "In reality, it's just a lot of circles of increasing \nalpha channel.",
                "The more circles we use, the smoother the \ntransition looks.",
                "This trick is pretty straightforward but it is \nalso pretty limiting.",
                "For example, it would be very complicated to add \na tint to the ligthing, ",
                "Like how most streetlights appear yellow-ish as \nopposed to fully white.",
                "More importantly, due to an internal bug within \nthe framework, ",
                "It is impossible to draw two overlapping light \nsources without - ",
                "Creating massive visual artifacts that cover the \nentire scene.",
                "Here is a little pool of shade for you to play \naround with."
            ]]
        ]

        const rockDialogue = [[
            "Hahaha.",
            "Nothing is real.",
            "I'm just a clump of pixels on screen.",
            "AHAHAHAHAHAHHAHAHAHAHAHAHAHHAHAHAHHAHAHAHAHAHAHAHAHA"
        ]];

        const signDialogue = [[
            "The fog is coming.",
            "There is nothing you can do about it."
        ]];

    

        console.log(this.shade.width);
        console.log(this.shade.x);

        this.cageEntities = [
            new Character({x:700, y:500}, this.container),
            new Rock(this.container, this.playerReference, {x:0, y:0}, rockDialogue),
            new SignPost(this.container, this.playerReference, {x:0,y:0}, signDialogue),
            new LightAura(this.playerReference, {x:2250,y: 100}, this.shade, this.foregroundContainer, 80, 20, 0xFF0000),
            
        ]



        //this.npcList.push(new Character({x:100, y:100}, this.container));

        //place signs every 500 pixels, followed by a cage
        for (let x =this.signSpacing;  x< this.totalWidth; x+=this.signSpacing){

            let i= x/500 - 1;

            //alternate between top sign and bottom sign
            let signYPosition = 0;
            let topOfCage = 0;
            let bottomOfCage = 0;

            if (i % 2 === 0){ //bottom
                signYPosition = 500;
                
                topOfCage = 400;
                bottomOfCage = 600;
            }
            else{ //top
                signYPosition = 100;

                topOfCage = 0;
                bottomOfCage = 200;
            }

            //create a new sign with the matching index dialogue
            let signDialogue = (i<signDialogues.length) ? signDialogues[i] : [[]];
            this.npcList.push(new SignPost(this.container, this.playerReference, {x:x, y:signYPosition},signDialogue));

            //create a cage to the right of the sign


            const leftBorder = new Rectangle(x+100, topOfCage, this.cageBorderWidth, bottomOfCage);
            const rightBorder = new Rectangle(x+100 + this.cageWidth - this.cageBorderWidth, topOfCage, this.cageBorderWidth, bottomOfCage);

            if (this.cageExceptions.includes(i)){
                const tb1 = new Rectangle(x+100, topOfCage, this.cageWidth / 2 - this.cageOpeningSize / 2, this.cageBorderWidth);
                const tb2 = new Rectangle(x+100 +this.cageWidth / 2 + this.cageOpeningSize / 2 , topOfCage, this.cageWidth / 2 - this.cageOpeningSize / 2, this.cageBorderWidth);
                
                const bb1 = new Rectangle(x+100, bottomOfCage - this.cageBorderWidth, this.cageWidth / 2 - this.cageOpeningSize / 2, this.cageBorderWidth);
                const bb2 = new Rectangle(x+100 +this.cageWidth / 2 + this.cageOpeningSize / 2, bottomOfCage - this.cageBorderWidth, this.cageWidth / 2 - this.cageOpeningSize / 2, this.cageBorderWidth);
            
                this.npcList.push(new RectangleNpc(this.container, this.playerReference, tb1, 0xFFFFFF ));
                this.npcList.push(new RectangleNpc(this.container, this.playerReference, tb2, 0xFFFFFF ));
                this.npcList.push(new RectangleNpc(this.container, this.playerReference, bb1, 0xFFFFFF ));
                this.npcList.push(new RectangleNpc(this.container, this.playerReference, bb2, 0xFFFFFF ));

            }
            else{
                const topBorder = new Rectangle(x+100, topOfCage, this.cageWidth, this.cageBorderWidth);
                const bottomBorder = new Rectangle(x+100, bottomOfCage - this.cageBorderWidth, this.cageWidth, this.cageBorderWidth);

                this.npcList.push(new RectangleNpc(this.container, this.playerReference, topBorder, 0xFFFFFF ));
                this.npcList.push(new RectangleNpc(this.container, this.playerReference, bottomBorder, 0xFFFFFF ));
            }


            this.npcList.push(new RectangleNpc(this.container, this.playerReference, leftBorder, 0xFFFFFF ));
            this.npcList.push(new RectangleNpc(this.container, this.playerReference, rightBorder, 0xFFFFFF ));


            //put something in the middle of the cage IF possible
            if (i < this.cageEntities.length){
                //make exception for the light source (can't be moved lol)
                if (i ===  3){
                    this.npcList.push(this.cageEntities[i]);
                    continue;
                }
                this.cageEntities[i].x = x+250;
                this.cageEntities[i].y = (topOfCage + bottomOfCage)/2;
                this.npcList.push(this.cageEntities[i]);

            }


        } 
    }

    update(delta, inputs){
        super.update(delta, inputs);

        //update internal timer
        this.elapsedTime += delta;

        //move the background vertically using the starting coords and cos functions
        for (let i = 0; i < this.backgrounds.length; i ++){
            let currentBg = this.backgrounds[i];
            let startCoords= this.backgroundsCoords[i];

            currentBg.y = startCoords.y - this.bgMoveAmplitude - (Math.sin(this.bgMoveSpeed * this.elapsedTime) * this.bgMoveAmplitude);
        }

        //bound the first player entity cuz system not flexing enough to implement collision system for more than one player 
        let pHitbox = this.cageEntities[0].getHitboxRectangle();


        if (pHitbox.x <= 605){
            pHitbox.x = 605;
        }
        else if (pHitbox.x + pHitbox.width > 895){
            pHitbox.x = 895 - pHitbox.width;
        }

        if (pHitbox.y <= 405 ){
            pHitbox.y = 405;
        }
        else if (pHitbox.y + pHitbox.height >= 595){
            pHitbox.y = 595 - pHitbox.height;
        }

        this.cageEntities[0].setHitboxRectangle(pHitbox)



    }
}