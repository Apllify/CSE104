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
        "Bar":"Sprites/Bar.png"        
    };


    // we want this scene to be a bit dark 
    shade = null;

    constructor(){
        
        super(0xeec39a);
        this.borderAlpha = 0;

    }


    //called after all of the required assets have been loaded
    load(){
        let background = new PIXI.Sprite(PIXI.Loader.shared.resources["Village"].texture)
        background.scale.x = 3
        super.load(background);

              

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

        const RockDialogues = [dialogueOne, dialogueTwo, dialogueThree, dialogueFour, dialogueFive, dialogueSix, dialogueSeven]
        const godDialogue = [
            [
                "Yield, for i am god, \nalmight harbinger of the elements.",
                "My child, you are hereby chosen \nto fulfill the prophetic duty.",
                "To the limit of your abilities, \nyou must spring forth and deliver my heavenly messages \nto the rest of the world.",
                "Thank you for your comprehension,",
                "Peace,",
                "GOD" 

            ]

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
                
                this.npcList.push(new Tree(this.container, this.playerReference, {x:i * 300 + 100, y:yposTree},[]))
            }

            else{
                let t = Math.random();
                let ypos = 110*t + 470*(1-t);
                this.npcList.push(new SignPost(this.container, this.playerReference, {x:i * 300 + 100, y:ypos}, []))
            }

            this.npcList.push(new Rock(this.container, this.playerReference, {x: i * 300 + 200, y:rocky}, RockDialogues[Math.floor(Math.random() * RockDialogues.length)]))

        }

        this.npcList.push(new LightSource(this.shade, this.foregroundContainer, this.container,[["Hey"]] ,this.playerReference, {x:9200, y:100}, 'RightPointing', 100, 30, 50, 1.5, 3, 1000));
        this.npcList.push(new LightSource(this.shade, this.foregroundContainer, this.container, [["Hey"]], this.playerReference, {x:9400, y:100}, 'LeftPointing', 100, 30, 50, 1.5, 3, 1000));
        this.npcList.push(new Bar(this.container, this.playerReference, {x:9300, y:50}));
        
    }


    update(delta, inputs){
        super.update(delta, inputs);
    }

    destroy(){
        super.destroy();
    }


}