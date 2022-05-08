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

    constructor(){
        super(0x7d4a28);


        const v1 = new Vector(1, 1);
        console.log(v1.snap45());

        const v2 = new Vector(1, -1);
        console.log(v2.snap45());

        const v3 = new Vector(-1, 1);
        console.log(v3.snap45());

        const v4 = new Vector(-1, -1);
        console.log(v4.snap45());
    }


    load(){
        super.load();

        this.setMapMatrix([[1, 1],[1, 2]]);

        for (let x = -800; x < this.getDimensions().width - 720; x += 80){
            for (let y = -600; y < this.getDimensions().height - 520; y += 80){
                let spriteIndex = Math.floor(Math.random() * 3) + 1;
                this.npcList.push(new Tile(this.backgroundContainer, this.playerReference, {x:x, y:y}, "Wood" + spriteIndex, {x:2, y:2}));
            }
        }

        this.npcList.push(new Chair(this.container, this.playerReference, {x:100, y:100}, [["YOooo"]]));
        this.npcList.push(new TutorialNpc(this.container, this.playerReference, {x:200, y:300}, [["I'm T"]], 'T', 'Tutorial', [{x:200, y: 300}, {x:300, y : 300}]));

    }


    update(delta, inputs){
        super.update(delta, inputs);
    }

    destroy(){
        super.destroy();
    }

}