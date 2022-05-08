class BarScene extends OutsideScene{
    requiredAssets = {
        "Shield":  "Sprites/Shield.png",
        "Chair": "Sprites/Chair.png",
        "Table": "Sprites/Table.png",
        "Wood1": "Sprites/Tiles/Wood1.png",
        "Wood2": "Sprites/Tiles/Wood2.png",
        "Wood3": "Sprites/Tiles/Wood3.png",
        'Tutorial': "Sprites/Npc/Npc10.png"

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

        //set the player position to look like it's at the entrance
        this.playerReference.setPosition({x:600, y:550});

        //create a teeny tiny bit of shade over the room
        this.shade = new PIXI.Graphics();
        this.shade.beginFill(0x000000);
        this.shade.drawRect(-1000, -800, 2000, 1600);
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
            loaded: function(err, sound) {
                // sound.filters = [
                //     new PIXI.sound.filters.TelephoneFilter(),
                // ];
                sound.volume = 0.3;
                sound.filters = [new PIXI.sound.filters.ReverbFilter(1, 5)];
                sound.play();

                setTimeout(function () {
                    sound.play();
                }, 50);
            }
        });





        for (let x = -760; x < this.getDimensions().width - 720; x += 80){
            for (let y = -560; y < this.getDimensions().height - 520; y += 80){
                let spriteIndex = Math.floor(Math.random() * 3) + 1;
                let newTile = new Tile(this.backgroundContainer, this.playerReference, {x:x, y:y}, "Wood" + spriteIndex, {x:2, y:2});
                newTile.update(0, inputs);
                this.tilesList.push(newTile);
            }
        }

        this.npcList.push(new Chair(this.container, this.playerReference, {x:100, y:100}, [["YOooo"]]));
        this.npcList.push(new TutorialNpc(this.container, this.playerReference, {x:200, y:300}, [{x:200, y: 300}, {x:300, y : 300}]));



    }


    update(delta, inputs){
        super.update(delta, inputs);
        
    }


    destroy(){
        window.localStorage.setItem('BarPlayerCoords', {x:this.playerReference.x, y:this.playerReference.y});
        super.destroy();

        this.backgroundMusic.pause();
        this.chatterSounds.pause();
    }

}