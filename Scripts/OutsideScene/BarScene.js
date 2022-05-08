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

        this.setMapMatrix([[1, 1],[1, 2]]);

        for (let x = -800; x < this.getDimensions().width - 760; x += 40){
            for (let y = -600; y < this.getDimensions().height - 560; y += 40){
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