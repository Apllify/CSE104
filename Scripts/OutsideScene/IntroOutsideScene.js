class IntroOutsideScene extends OutsideScene{

    requiredAssets = {
        "God Spritesheet": "Sprites/God.json",
        "Rock": "Sprites/Rock.png",
        "Shield":  "Sprites/Shield.png"
    };

    constructor(){
        super();

    }


    //called after all of the required assets have been loaded
    load(){
        super.load();

        //create a door npc
        this.npcList.push( new BrokenDoor(this.container,  this.playerReference, {x:0, y:300}));
        this.npcList.push(new BossWarp(this.container,  this.playerReference, {x:600, y:300}));

                
        //create a few rock npcs for decoration
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

        this.npcList.push(new Rock(this.container, this.playerReference, {x:200, y:250}, dialogueOne));
        this.npcList.push(new Rock(this.container, this.playerReference, {x:100, y:50}, dialogueOne));
        this.npcList.push(new Rock(this.container, this.playerReference, {x:230, y:220}, dialogueOne));
        this.npcList.push(new Rock(this.container, this.playerReference, {x:50, y:80}, dialogueOne));

        this.npcList.push(new Rock(this.container, this.playerReference, {x:600, y:100}, dialogueTwo));
        this.npcList.push(new Rock(this.container, this.playerReference, {x:1000, y:250}, dialogueThree));
        this.npcList.push(new Rock(this.container, this.playerReference, {x:1400, y:250}, dialogueFour));
        this.npcList.push(new Rock(this.container, this.playerReference, {x:1800, y:250}, dialogueFive));
        this.npcList.push(new Rock(this.container, this.playerReference, {x:2200, y:250}, dialogueSix));
        this.npcList.push(new Rock(this.container, this.playerReference, {x:2600, y:250}, dialogueSeven));


        this.npcList.push(new God(this.container, this.playerReference, {x:400, y:500}, godDialogue));


        this.setMapMatrix([[2, 1, 1, 1, 1, 1]])
    }


    update(delta, inputs){
        super.update(delta, inputs);
    }

    destroy(){
        super.destroy();
    }


}