class IntroOutsideScene extends OutsideScene{

    requiredAssets = {
        "God Spritesheet": "Sprites/God.json",
        "Rock": "Sprites/Rock.png",
        "Shield":  "Sprites/Shield.png",
        "Sign": "Sprites/Sign.png",
        "Village":"Sprites/VillageRoad.png",
        "Tree":"Sprites/Tree.png",
        "LeftPointing":"Sprites/LeftPointing.png",
        "RightPointing":"Sprites/RightPointing.png",
        "Bar":"Sprites/Bar.png",
        "Concrete1" :"Sprites/Tiles/Concrete1.png", 
        "Concrete2" :"Sprites/Tiles/Concrete2.png", 
        "Concrete3" :"Sprites/Tiles/Concrete3.png", 
        "Chair": "Sprites/Chair.png",
        "Person": "Sprites/Npc/Npc1.png"
        

    };


    // we want this scene to be a bit dark 
    shade = null;
    shadeGradient = [];
    shadeGradientHeight = 40;
    shadeGradientQuantity = 100;
    tilesList = [];

    constructor(){
        
        super(0xeec39a);
        this.borderAlpha = 0;

    }


    //called after all of the required assets have been loaded
    load(){
        //let background = new PIXI.Sprite(PIXI.Loader.shared.resources["Village"].texture)
        //background.scale.x = 3
        super.load();

        //start the player interaction prompt 
        this.playerReference.enableInteractionPrompt();

              

        
        this.playerReference.x = 9000;
        
        const rockDialogues = [
            [
                ["This is just a rock.",
            "What did you expect ?"]
            ],
            [
                ["This is just a rock.",
                "Unless ",
                "...",
                "....",
                ".....",
                "......",
                "Nah just kidding."]
            ],
            [
                ["Is this even a rock ?"]
            ],
            [
                ["Tag three friends that LOVE rocks ! "]
            ],
            [
                ["Subscribe and smash the like button for a chance \nto win : ",
                "Rock."]
            ],

        ]
        


        const treeDialogues = [
            [
                ["Ahh, the air is so full of pollen and-",
                "Microplastics."]
            ],
            [
                ["Bark bark.",
                "Bark, bark bark ! ",
                "Bark.",
                "What could the tree mean by this ?"]
            ],
            [
                ["This tree is littered with a list of faintly legible scribbles : ",
                '"Catreena, Treeodore, Matreew, Autree, Timberly..."',
                "The footer reads : ",
                '"Top 100 Tree names of 2022."']
            ],
            [
                ["A small banner reads : ",
                '"Shea / Herb"',
                "The trees have pronounce now ?"]
            ],
            [
                [""]
            ],
            [
                ["A simple tree, with a preference for brevity."]
            ],
            [
                ["Pictured here is the tree in its natural inhabitat.",
                "Elegant, peaceful, and unbothered.",
                "In most regions, the tree stands as an untouchable \ntitan of bark.",
                "Here, however, there exists a vile predator with a \ngrudge against timber.",
                "The murderer goes by the name of : ",
                "SIGN PAINTER."]
            ],
            [
                ["The tree has an engraving that reads : ",
                '"Aba <3 Gunther"',
                "To its right, is a scribble of phallic nature."]
            ],
            [
                ["Oh no, the tree fandom is dying.",
                'For more information, look up "Industrial Society \nand Its Future" by Theodore Kaczynski.']
            ],
        ];




        const signDialogues = [

            [[
                "Hi ! Welcome to TownSquare !",
                "Where dreams come true :)",
                "Not really actually.",
                "I haven't seen it happen personally :(",
                "But hey, I've heard the stories...",
                "Maybe you could be the next one, who knows. ",
                "Signed - ",
                "The Sign Painter."
            ],
            [
                "Hi ! Welcome to TownSquare !",
                "Where dreams come true :)",
                "Wait wh- why are you still here ?",
                "You do realize that I can't just repaint a sign \nafter you've read it ?",
                "That would be a stupid amount of work for one \npractical joke wouldn't it ?",
                "Signed - ",
                "The Sign Painter."
            ],
            [
                "*The sign is littered with unintelligible \nand hastily painted flops*",
                "*You can still make out some of the letters*",
                '"Si..n pa...er"'
            ]
        
        
        ],
        
            [
            [
                "TIP : Use ENTER to read signs",
                "Signed - ",
                "The Sign Painter."

            ],

        ],

        [[
            "Anyways, what brings you here ?",
            "Not a lot of people end up on this street \nvoluntarily.",
            "How could I tell that you were new ?",
            "Well.",
            "Your eyes are still glowing like a first-timer's. ",
            'Some call it "glee", we call it inexperience',
            "Signed - ",
            "The Sign Painter."

        ]],


        [[
            "By the way, I was thinking.",
            "Would you like to join me ?",
            "Come on, don't look at me like that, you know what \nI meant.",
            "Just me, you, and an endless supply of hardwood \nsigns.",
            "Ok, yeah, it's a little repetitive.",
            "But there's not really anything else to do around \nhere, y'know ?",
            "Signed - ",
            "The Sign Painter."

        ]],


        [[
            "Wait, now that I think about it.",
            "You're not like the others are you ?",
            "You don't really look like anyone else I know ?",
            "I mean.",
            "I'm no commoner, I travelled through pretty much \nthe entire kingdom.",
            "But I've never seen anything like ... you ?",
            "No offense, but you look closer to animals if \nanything.",
            "Signed - ",
            "The Sign Painter."
        ]],


        [[
            "Eh, I thought about it.",
            "Doesn't matter actually.",
            "As long as you're a good person.",
            "That's my 2-cents.",
            "Are you gonna cruise through all of this ?",
            "Or, are you more of a trial and error guy ?",
            "What am I talking about ?",
            "I don't really know either...",
            "Signed - ",
            "The Sign Painter."
        ]],


        [[
            "Say, I remember reading this one religious book, \nwhen I was younger.",
            "It was reaaaaally boring. ",
            "But.",
            "You wouldn't be one of \"those\", would you ?",
            "Signed - ",
            "The Sign Painter."
        ]],


        [[
            "Ok sorry I broke my promise.",
            "No more questioning your identity.",
            "You probably have enough questions on your own.",
            "I guess I should probably help you get used to this \nplace, then.",
            "So it all started 30 years ago when -",
            "Wait do you hear that sound ?",
            "Signed - ",
            "The Sign Painter."
        ]],


        [[
            "Hm, doesn't matter, I'm just a little more tired \nrecently.",
            "So many... distractions. So much... information.",
            "All I want is a little bit of peace.",
            "Is that too much to ask for ?",
            "Signed - ",
            "The Sign Painter."
        ]],

        [[
            "Anyways, for the story.",
            "You could say that this town was FOUNDED 30 \nyears ago.",
            "But really we've been here much longer.",
            "Mentally.",
            "It's kinda hard to stay neutral in this climate.",
            "Don't worry, though, that's not the ONLY thing \nwe talk about.",
            "We have AT LEAST 2 other topics.",
            "Signed - ",
            "The Sign Painter."
        ]],


        [[
            "But, even then.",
            "We usually just talk about politics.",
            "I know, ugh.",
            "Sometimes, I just kind of wish I could back to my \nold life.",
            "Waking up, eating breakfast, going to work...",
            "But there's really no going back from this.",
            "At least I have purpose, to keep me company, I \nguess.",
            "But is purpose really the goal of life ?",
            "Something to think about...",
            "Signed - ",
            "The Sign Painter."
        ]],

        [[
            "Say, do you have a purpose yourself ?",
            "If you don't, that's fine, you're about to.",
            "Ahead of you lies the greatest technopolis of our \ntime.",
            "Filled with neon bright lights and all.",
            "A true modern forum of thought and ideals.",
            "Careful not to lose your breath...",
            "Signed - ",
            "The Sign Painter."
        ]],


        [[
            "A few quick tips before going in : ",
            "Don't look back !",
            "That's it.",
            "Signed - ",
            "The Sign Painter."
        ]],


        [[
            "Sorry, I just couldn't resist the appeal of brevity.",
            "People really underestimate the impact of short \nprose.",
            "Anyways.",
            "I should let you know that the people here aren't.",
            "How can I put this.",
            ".",
            "..",
            "...",
            "Nice ?",
            "We're just not very used to seeing new faces is \nall.",
            "But I think you could fit right in.",
            "Whatever you do, you should NEVER EVER EVER - ",
            "Be mean to people :)",
            "Signed - ",
            "The Sign Painter."
        ]],


        [[
            "Oh would you look at that.",
            "This is my last sign.",
            "Not that I ran out of wood.",
            "I just thought it would be good to split off here.",
            "I'm sorry that I couldn't be of more assistance.",
            "But the least I can do is wish you good luck.",
            "Your new life starts here...",
            "Signed - ",
            "A Friend."
        ]]

        ];

        
        


        //set the map to have a specific shape
        this.setMapMatrix([[2,1,1,1,1,1,1,1,1,1,1,1]]);
        if (window.localStorage.getItem('IntroScenePlayerCoords') != null){
            // if the barscene was accessed at a previous time, set the player position to the last position
            this.playerReference.setPosition(JSON.parse(window.localStorage.getItem('IntroScenePlayerCoords')));
        }

        //instantiate a shade cloak over the entire scene at all times

        
        //set up the shade and add it to the foreground 
        this.shade = new PIXI.Graphics();

        this.shade.beginFill(0x000000);
        this.shade.drawRect(0, 0, 9600, 600);
        this.shade.endFill();

        //setup a gradient of shades all around the screen
        const miniShadeHeight = this.shadeGradientHeight / this.shadeGradientQuantity;

        for (let i =0; i < this.shadeGradientQuantity; i ++){
            let miniShade = new PIXI.Graphics();

            miniShade.beginFill(0x000000);
            miniShade.drawRect(0,  miniShadeHeight * i, 800, miniShadeHeight);
            miniShade.drawRect(0, 600 - miniShadeHeight * (i+1), 800, miniShadeHeight);
            miniShade.drawRect(miniShadeHeight * i, 0, miniShadeHeight, 600);
            miniShade.drawRect(800 -  miniShadeHeight * (i+1), 0, miniShadeHeight, 600);


            miniShade.endFill();

            miniShade.alpha = Math.min(0.8, 1 - (i / this.shadeGradientQuantity)); 

            drawLayers.foregroundLayer.addChild(miniShade);


            this.shadeGradient.push(miniShade);
        }
    

        this.shade.alpha = 0.7;

        this.foregroundContainer.addChild(this.shade);
        
        
        // add some npcs to decorate 
        for(let i = 0; i < 30; i ++){
            let yposTreeChoice = [Math.random() * 100 , 475 + Math.random()*(600-480)];
            let yposTree = yposTreeChoice[Math.floor(Math.random() * 2)];
            let rocky = yposTreeChoice[Math.floor(Math.random() * 2)];


            if (i % 2 === 1){
                let treeDialogueIndex = Math.floor(Math.random() * treeDialogues.length);

                this.npcList.push(new Tree(this.container, this.playerReference, {x:i * 300 + 100, y:yposTree},treeDialogues[treeDialogueIndex]));
            }

            else{
                let t = Math.random();
                let ypos = 110*t + 470*(1-t);
                this.npcList.push(new SignPost(this.container, this.playerReference, {x:(i+1) * 300 + 100, y:ypos}, signDialogues[i/2]))

                //add some light auras around every single sign
                this.npcList.push(new LightAura(this.playerReference, {x:(i+1) * 300 + 100, y:ypos}, this.shade, this.foregroundContainer, 80, 30 ));
            }

            let rockDialogueIndex = Math.floor(Math.random() * rockDialogues.length);
            this.npcList.push(new Rock(this.container, this.playerReference, {x: i * 300 + 200, y:rocky}, rockDialogues[rockDialogueIndex]));

        }
        this.npcList.push(new Person(this.container, this.playerReference, {x:200, y:200},[['Heck']], 'You Know', 'Person', [{x:400, y:200}], 20))
        this.npcList.push(new LightSource(this.shade, this.foregroundContainer, this.container,[["Bar entrance to the right !!!"]] ,this.playerReference, {x:9200, y:100}, 'RightPointing', 100, 20, 50, 1.5, 3, 1000));
        this.npcList.push(new LightSource(this.shade, this.foregroundContainer, this.container,[["49 Buried, 0 Found."]], this.playerReference, {x:9400, y:100}, 'LeftPointing', 100, 20, 50, 1.5, 3, 1000));
        this.npcList.push(new Bar(this.container, this.playerReference, {x:9300, y:50}));



        //create some background tiles for the road
        for(let x = 20; x < this.getDimensions().width; x += 40){
            for (let y = 120; y < 500; y += 40 ){
                let spriteIndex = Math.floor(Math.random() * 3) + 1;
                let newTile = new Tile(this.backgroundContainer, this.playerReference, {x:x, y:y}, "Concrete" + spriteIndex);
                newTile.update(0, inputs);
                this.tilesList.push(newTile);
            }
        }
        
    }


    update(delta, inputs){
        super.update(delta, inputs);
        // store position of player for future sessions 
        window.localStorage.setItem('IntroScenePlayerCoords', JSON.stringify(this.playerReference.getPosition()))
    }

    destroy(){
        super.destroy();
    }


}