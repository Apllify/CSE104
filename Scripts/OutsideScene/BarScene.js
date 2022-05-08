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
    constructor(){
        super(0x7d4a28);
    }


    load(){
        super.load();

        this.setMapMatrix([[1, 1],[1, 2]]);

        if (window.localStorage.getItem('BarPlayerCoords') != null){
            this.setPlayerPosition(window.localStorage.getItem('BarPlayerCoords'));
        }
        
        for (let x = -800; x < this.getDimensions().width - 760; x += 40){
            for (let y = -600; y < this.getDimensions().height - 560; y += 40){
                let spriteIndex = Math.floor(Math.random() * 3) + 1;
                let newTile = new Tile(this.backgroundContainer, this.playerReference, {x:x, y:y}, "Wood" + spriteIndex);
                newTile.update(0, inputs);
                this.tilesList.push(newTile);
            }
        }

        this.npcList.push(new Chair(this.container, this.playerReference, {x:100, y:100}, [["YOooo"]]))
        this.npcList.push(new TutorialNpc(this.container, this.playerReference, {x:200, y:300}, [["I'm T"]], 'T', 'Tutorial', []))
        this.npcList.push(new TrapDoor(this.container, this.playerReference, {x:500, y:600}, [['yoo']], 
        !window.localStorage.getItem('BarPlayerCoords') == null))
        
    }


    update(delta, inputs){
        super.update(delta, inputs);
        
    }


    destroy(){
        window.localStorage.setItem('BarPlayerCoords', {x:this.playerReference.x, y:this.playerReference.y});
        super.destroy();
    }

}