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
        "Chair":"Sprites/Chair.png"

    };


    // we want this scene to be a bit dark 
    shade = null;

    constructor(){
        
        super(0xeec39a);
        this.borderAlpha = 0;

    }


    //called after all of the required assets have been loaded
    load(){
        //let background = new PIXI.Sprite(PIXI.Loader.shared.resources["Village"].texture)
        //background.scale.x = 3
        super.load();

              

        //create a door npc
        const roadUpperEdge = 100;
        const roadLowerEdge = 480;
        const totalWidth = 9600;
        this.playerReference.x = 9200;
        
        const dialogueOne = [
            ["This is just a rock.",
        "What did you expect ?"]
        ];

        const dialogueTwo = [
            ["This is just a rock.",
            "Unless ",
            "...",
            "....",
            ".....",
            "......",
            "Nah just kidding."]
        ];

        const dialogueThree = [
            ["Is this a rock ?"]
        ];

        const dialogueFour = [
            ["rock"]
        ];

        const dialogueFive = [
            ["Tag three friends that looooove rocks ! "]
        ];

        const dialogueSix = [
            ["Upvote, share, and retweet for a chance to win : ",
            "Rock."]
        ];
        
        const dialogueSeven = [
            ["Hihi"]
        ];

        const RockDialogues = [dialogueOne, dialogueTwo, dialogueThree, dialogueFour, dialogueFive, dialogueSix, dialogueSeven];

        const signDialogues = [

            [[
                "Hi ! Welcome to TownSquare !",
                "Where dreams come true :)",
                "Not really actually.",
                "I haven't seen it happen personally :(",
                "But hey, I've heard the stories...",
                "Maybe you could be the next one, who knows. ",
                "Signed - ",
                "The Sign Painter"
            ],
            [
                "Hi ! Welcome to TownSquare !",
                "Where dreams come true :)",
                "Wait wh- why are you still here ?",
                "You do realize that I can't just repaint a sign \nafter you've read it ?",
                "That would be a stupid amount of work for one \npractical joke wouldn't it ?",
                "Signed - ",
                "The Sign Painter"
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
                "The Sign Painter"

            ],

        ],

        [[
            "Anyways, what brings you here ?",
            "Not a lot of people end up on this street voluntarily.",
            "How could I tell that you were new ?",
            "Well.",
            "Your eyes are still glowing like a first-timer's. ",
            'Some call it "glee", we call it inexperience',
            "Signed - ",
            "The Sign Painter"

        ]],


        [[
            "By the way, I was thinking.",
            "Would you like to join me ?",
            "Come on, don't look at me like that, you know what I meant.",
            "Just me, you, and the hardwood signs.",
            "Ok yeah it's a little repetitive.",
            "But there's not really anything else to do around here, y'know ?",
            "Signed - ",
            "The Sign Painter"

        ]],


        [[
            "Wait, now that I think about it.",
            "You're not like the others are you ?",
            "You don't really look like anyone else I know ?",
            "I mean.",
            "I'm no commoner, I travelled through pretty much the entire kingdom.",
            "But I've never seen anything like ... you ?",
            "No offense, but you look closer to animals if anything.",
            "Signed - ",
            "The Sign Painter"
        ]],


        [[
            "Eh, I thought about it.",
            "Doesn't matter actually.",
            "As long as you're a good person.",
            "That's my verdict.",
            "Are you gonna cruise through all of it ?",
            "Or are you more of a trial and error person ?",
            "What am I talking about ?",
            "I don't really know either...",
            "Signed - ",
            "The Sign Painter"
        ]],


        [[
            
        ]],


        [[]],
        [[]],
        [[]],
        [[]],
        [[]],
        [[]],
        [[]],
        [[]]

        ];

        
        


        //set the map to have a specific shape
        this.setMapMatrix([[2,1,1,1,1,1,1,1,1,1,1,1]]);

        //instantiate a shade cloak over the entire scene at all times

        
        //set up the shade and add it to the foreground 
        this.shade = new PIXI.Graphics();

        this.shade.beginFill(0x000000);
        this.shade.drawRect(0, 0, 9600, 600);
        this.shade.endFill();
    

        this.shade.alpha = 0.8;

        this.foregroundContainer.addChild(this.shade);
        
        // add some npcs to decorate 
        for(let i = 0; i < 30; i ++){
            let yposTreeChoice = [Math.random() * 100 , 475 + Math.random()*(600-480)];
            let yposTree = yposTreeChoice[Math.floor(Math.random() * 2)];
            let rocky = yposTreeChoice[Math.floor(Math.random() * 2)];


            if (i % 2 === 1){
                this.npcList.push(new Chair(this.container, this.playerReference, {x:i * 300 + 100, y:yposTree},[]))
            }

            else{
                let t = Math.random();
                let ypos = 110*t + 470*(1-t);
                this.npcList.push(new SignPost(this.container, this.playerReference, {x:i * 300 + 100, y:ypos}, signDialogues[i/2]))
            }

            this.npcList.push(new Rock(this.container, this.playerReference, {x: i * 300 + 200, y:rocky}, RockDialogues[0]))

        }

        this.npcList.push(new LightSource(this.shade, this.foregroundContainer, this.container,[["Hey"]] ,this.playerReference, {x:9200, y:100}, 'RightPointing', 100, 20, 50, 1.5, 3, 1000));
        this.npcList.push(new LightSource(this.shade, this.foregroundContainer, this.container, [["Hey"]], this.playerReference, {x:9400, y:100}, 'LeftPointing', 100, 20, 50, 1.5, 3, 1000));
        this.npcList.push(new Bar(this.container, this.playerReference, {x:9300, y:50}));



        //create some background tiles for the road
        for(let x = 20; x < totalWidth; x += 40){
            for (let y = 120; y < 500; y += 40 ){
                let spriteIndex = Math.floor(Math.random() * 3) + 1;

                this.npcList.push(new Tile(this.backgroundContainer, this.playerReference, {x:x, y:y}, "Concrete" + spriteIndex));
            }
        }
        
    }


    update(delta, inputs){
        super.update(delta, inputs);
    }

    destroy(){
        super.destroy();
    }


}