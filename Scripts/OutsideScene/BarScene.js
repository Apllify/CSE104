class BarScene extends OutsideScene{
    requiredAssets = {
        "Shield":  "Sprites/Shield.png",
        "Chair": "Sprites/Chair.png",
        "Table": "Sprites/Table.png",
        "Wood1": "Sprites/Tiles/Wood1.png",
        "Wood2": "Sprites/Tiles/Wood2.png",
        "Wood3": "Sprites/Tiles/Wood3.png"

    }

    constructor(){
        super(0x7d4a28);
    }


    load(){
        super.load();

        this.setMapMatrix([[2, 1],[1, 1]]);

        for (let x = 0; x < this.getDimensions().width + 40; x += 40){
            for (let y = 0; y < this.getDimensions().height + 40; y += 40){
                let spriteIndex = Math.floor(Math.random() * 3) + 1;
                this.npcList.push(new Tile(this.backgroundContainer, this.playerReference, {x:x, y:y}, "Wood" + spriteIndex));
            }
        }

        this.npcList.push(new Chair(this.container, this.playerReference, {x:100, y:100}, [["YOooo"]]))
        

    }


    update(delta, inputs){
        super.update(delta, inputs);
    }

    destroy(){
        super.destroy();
    }

}