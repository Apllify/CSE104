'use strict';
class BarScene extends OutsideScene{
    requiredAssets = {
        'Shield':  'Sprites/Shield.png',
        "Chair": "Sprites/Chair.png",
        "BrokenChair": "Sprites/BrokenChair.png",
        "Table": "Sprites/Table.png",
        "Wood1": "Sprites/Tiles/Wood1.png",
        "Wood2": "Sprites/Tiles/Wood2.png",
        "Wood3": "Sprites/Tiles/Wood3.png",
        'TutorialFirst': "Sprites/Npc/Npc10.png",
        'TutorialSecond': "Sprites/Npc/Npc11.png",
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
        'Npc9' : 'Sprites/Npc/Npc9.png',
        'Vomit': 'Sprites/Npc/Vomit.png'

    }

    tilesList = [];
    shade = null;

    backgroundMusic = null;
    chatterSounds = null;

    constructor(){
        super(0x7d4a28);
        


    }


    load(){
        super.load();

        this.setMapMatrix([[1, 1],[1, 2]]);

        
        if (window.localStorage.getItem('BarPlayerCoords') != null){
            // if the barscene was accessed at a previous time, set the player position to the last position
            this.playerReference.setPosition(JSON.parse(window.localStorage.getItem('BarPlayerCoords')));
        }

        else{
            //set the player position to look like it's at the entrance
            this.playerReference.setPosition({x:750, y:300});
        }
        //create a teeny tiny bit of shade over the room
        this.shade = new PIXI.Graphics();
        this.shade.beginFill(0x000000);
        this.shade.drawRect(-1200, -1000, 2400, 2000);
        this.shade.endFill();

        this.shade.alpha = 0.5

        this.foregroundContainer.addChild(this.shade);


        //create a few light sources around the room
        this.npcList.push(new LightAura(this.playerReference, {x:0, y:0}, this.shade, this.foregroundContainer, 500, 100));
        this.npcList.push(new LightAura(this.playerReference, {x:-600, y:400}, this.shade, this.foregroundContainer, 200, 50));
        this.npcList.push(new LightAura(this.playerReference, {x:600, y:400}, this.shade, this.foregroundContainer, 200, 50));
        this.npcList.push(new LightAura(this.playerReference, {x:-600, y:-400}, this.shade, this.foregroundContainer, 200, 50));
        this.npcList.push(new LightAura(this.playerReference, {x:600, y:-400 }, this.shade, this.foregroundContainer, 200, 50));

        //create and play the background music 
        this.backgroundMusic = PIXI.sound.Sound.from({
            url: '././Music/BarAmbiance.mp3',
            preload: true,
            loop : true,
            loaded: function(err, sound) {
                // sound.filters = [
                //     new PIXI.sound.filters.TelephoneFilter(),
                // ];
                sound.volume = 0.2;
                sound.filters = [new PIXI.sound.filters.ReverbFilter(1, 5)];
                sound.play();

                setTimeout(function () {
                    sound.play();
                }, 50);
            }
        });

        this.chatterSounds = PIXI.sound.Sound.from({
            url: '././Sound/BarScene/chatter.mp3',
            preload: true,
            loop : true,
            loaded: function(err, sound) {
                // sound.filters = [
                //     new PIXI.sound.filters.TelephoneFilter(),
                // ];
                sound.volume = 0.1;
                sound.filters = [new PIXI.sound.filters.ReverbFilter(1, 5)];
                sound.play();

                setTimeout(function () {
                    sound.play();
                }, 50);
            }   
        });




        // Set up the tiles of the floor 
        for (let x = -760; x < this.getDimensions().width - 720; x += 80){
            for (let y = -560; y < this.getDimensions().height - 520; y += 80){
                let spriteIndex = Math.floor(Math.random() * 3) + 1;
                let newTile = new Tile(this.backgroundContainer, this.playerReference, {x:x, y:y}, "Wood" + spriteIndex, {x:2, y:2});
                newTile.update(0, inputs);
                this.tilesList.push(newTile);
            }
        }

        //this.npcList.push(new Chair(this.container, this.playerReference, {x:700, y:500}, [["YOooo"]], true, 0));
        //this.npcList.push(new TutorialNpc(this.container, this.playerReference, {x:200, y:300}, [{x:200, y: 300}, {x:300, y : 300}], window.localStorage.getItem('TutorialComplete') == null));
        

        this.npcList.push(new TrapDoor(this.container, this.playerReference, this.adjustedPosition({x:1400, y:100}), 
        (window.localStorage.getItem('TutorialComplete') == 1)));
        
        this.npcList.push(new BarExit(this.container, this.playerReference, {x:780, y:300}, [["Leaving so soon?"]], true));


        //setup the first table (one person seated alone)
        const impDialogue = [
            [
                "Hehe, you think I'm so mysterious don't you ?",
                "Pain changes people...",
            ],
            [
                "Watch your back.",
                "The people closest to you cut the deepest... ",
            ],
            [
                "Which is why is have no friends."
            ],
            [
                "Hehe >:)"
            ]
        ];

        const impChairDialogue = [
            [
                "I'm so fed up with this guy.",
                "He's just been rambling about society for the \npast 3 hours.",
                "I'm gonna break the fabric of reality and \nmove to another table if he goes again."
            ]
        ]

        this.npcList.push(new Chair(this.container, this.playerReference, {x:200, y:445}, [], true));
        this.npcList.push(new Chair(this.container, this.playerReference, {x:0, y:450}, impChairDialogue ,false));
        this.npcList.push(new Table(this.container, this.playerReference, {x:100, y:450}, []));
        this.npcList.push(new Person(this.container, this.playerReference, {x:200, y:430}, impDialogue, "Em", "Npc4", []));


        //setup the second table (group of three)
        const shockedDialogue = [
            [
                "Did you talk to wick ?",
                "They always do this thing where they -",
                "Lie.",
                "But, I swear, they're a really genuine and caring \nperson, most of the time.",
                "It's just that, whenever new people join in, they \ntry to impress them so badly ?",
                "And, usually, that just results in them alienating \nand putting us down.",
                "We're friends, so we go with it, but it kind of \nhurts to see them like this...",
                "It's like seeing them trapped inside of their own \nbody. ",
                "We know that they're not that person, and that it's \nall an act.",
                "And you could almost see their soul pleading to be \nfreed through their facial expression.",
                "But I can't really confront them on it, can I ?",
                "It would feel wrong because it's not something \nthey control.",
                "Behind the scenes, when the makeup is off, they're \na terribly anxious person.",
                "And I'm guessing that this character they play \nis them compensating for that.",
                "It's everything they'd like to be...",
                "Confident, witty, emotionless, and a center of \nattention.",
                "Why ?",
                "I just don't understand."
            ]
        ];

        const winkyDialogue = [
            [
                "Hey, what's up.",
                "This is kind of my personnal bar spot.",
                "And I guess these guys are with me sometimes.",
                "Unironic most boring people I've met in my entire \nlife.",
                ";)",
                "Anyways, what are you here for ?",
            ],

        ];

        const frownDialogue = [
            [
                "Oh god, you a newcomer ?",
                "It's gonna be one of those nights..."
            ]
        ];


        const tableDialogue = [
            [
                "Just three bros chilling around a table.",
                "200 pixels apart cause they're not gay."
            ]];

        
        this.npcList.push(new Chair(this.container, this.playerReference, {x:-700, y:365}, [], false));
        this.npcList.push(new Chair(this.container, this.playerReference, {x:-480, y:235}, [], true));
        this.npcList.push(new Chair(this.container, this.playerReference, {x:-450, y:415}, [], true));  

        this.npcList.push(new Table(this.container, this.playerReference, {x:-580, y:350}, tableDialogue));

        this.npcList.push(new Person(this.container, this.playerReference, {x:-700, y:350}, shockedDialogue, "Shaux", "Npc2", [], true));
        this.npcList.push(new Person(this.container, this.playerReference, {x:-480, y: 220}, winkyDialogue, "Wick", "Npc6", []));
        this.npcList.push(new Person(this.container, this.playerReference, {x:-450, y:400}, frownDialogue, "Frown", "Npc3", []));


        //setup the third table (center of room, only one person)
        const nerdDialogue = [
            [
                "Hey !",
                "We just played a game of poker, it was a blast.",
                "I.. don't know where the others went though.",
                "Eh, they probably went home."
            ],
            [
                "Why am I still here ?",
                "I'm celebrating !",
                "I just won on a pair of aces."
            ],
            [
                "Now that I think about it.",
                "Tutorial looked pretty unwell after that last \ngame.",
                "You should probably go check on him in the bar \ncorner..."
            ],
            [
                "Why am I not doing it myself ?",
                'Well, I was always labeled a "nerd" growing up.',
                'And so, in response, I made my personallity \nrevolve around intelligence and academic prowess. ',
                "It was really just an attempt at feeling wanted \nfor once.",
                "Over time, this led to me having very few friends \ngrowing up.",
                "And being out of touch with the social norms of \nmy time.",
                "Even my introspections are these long bland \nblocs of text.",
                "Nowadays, I just don't have it in me to connect \nemotionally with other people.",
                "Or, whenever I do, it comes off as insincere or \npretentious.",
                "I just wish I could pull it off.",
                "You have no idea how much it pains me to stay \nwatching from the sidelines.",
                'But any attempt at empathizing is brushed off as \n"pretending to be nice".',
                'So now I\'m the "emotionless" "1-dimensional" \nnerd.',
                "Woops sorry I monologued, I don't really have \nanyone that listens like you, usually.",
                "I'm sorry to burden you like this, allow me to go \nback to my feigned self."
            ],
            [
                "Greetings human.",
                "I am - ",
                "The Nerd.",
                "E = mc2.",
                "The speed of light is 300 000m/s.",
            ]
        ];

        this.npcList.push(new Chair(this.container, this.playerReference, {x:-100, y:-185}, [], false));
        this.npcList.push(new Chair(this.container, this.playerReference, {x:-80, y:-40}, [], false, 9));
        this.npcList.push(new Chair(this.container, this.playerReference, {x:-90, y:-20}, [], false, 6));

        this.npcList.push(new Chair(this.container, this.playerReference, {x:100, y:-185}, [], true, 7));
        this.npcList.push(new Chair(this.container, this.playerReference, {x:150, y:-60}, [], true, 9));
        this.npcList.push(new Chair(this.container, this.playerReference, {x:110, y:-0}, [], true, 4));


        this.npcList.push(new Table(this.container, this.playerReference, {x:25, y:-100}, []));

        this.npcList.push(new Person(this.container, this.playerReference, {x:-100, y:-200}, nerdDialogue, "Ned", "Npc1", [], true));


        //setup the fourth "table", really just a guy pacing back and fourth on the left
        const madDialogue = [
            [
                "I'm not mad",
                "I'm not mad.",
                "I am not mad.",
                "I - ",
                "Not mad.",
                "Yep.",
                "I'm perfectly fine thanks for asking."
            ]
        ];

        this.npcList.push(new Person(this.container, this.playerReference, {x:-700, y:0}, madDialogue, "Mad", "Npc5", [{x:-750, y:0}, {x:-650, y:0}], false, 200));
        this.npcList.push(new Chair(this.container, this.playerReference, {x:-700, y:100}, [], true, 4, true))


        //setup the fifth table (two people in top right)
        const fedupDialogue = [
            ["You barely wagered anything.",
            "Try losing your mortgage, see how that feels."]
        ]; 
        
        const cryingDialogue = [
            ["I just.",
            "I can't do this anymore",
            "How does he keep getting away with it.",
            "I don't.",
            "Wanna play anymore..."]
        ];

        this.npcList.push(new Person(this.container, this.playerReference, {x:480, y:-330}, fedupDialogue, "Man", "Npc7", [], true));
        this.npcList.push(new Person(this.container, this.playerReference, {x:610, y:-300}, cryingDialogue, "I can't", "Npc9", [], false));


        //setup the sixth table (tutorial vomitting)
        this.npcList.push(new Vomit(this.backgroundContainer, this.playerReference, {x:-550, y:-480}));
        this.npcList.push(new Table(this.container, this.playerReference, {x:-650, y:-520}, []));
        this.npcList.push(new TutorialNpc(this.container, this.playerReference, {x:-550, y:-500}, [], (window.localStorage.getItem('TutorialComplete') != 1)));
        







    }


    update(delta, inputs){
        super.update(delta, inputs);
       
    }


    //called right before this scene is destroyed
    unload(){
        this.backgroundMusic.pause();
        this.chatterSounds.pause();
        // Keep Track of the player position to use it in the next session
        window.localStorage.setItem('BarPlayerCoords', JSON.stringify(this.playerReference.getPosition()))
        
    }




}