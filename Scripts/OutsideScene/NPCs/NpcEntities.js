class BrokenDoor extends Npc{

    constructor(container, drawLayers, playerReference, position){
        const monologuesList = [
            ["This door doesn't seem to open...",
        "Perhaps you should come back later..."]
        ];

        const textStyle = new PIXI.TextStyle({
                fontFamily : "BrokenConsole",
                fontSize : 24,
                fontWeight : "bold",
                fill : "#ffffff",
                stroke : "#ffffff",
            });
        

        super(container, drawLayers.foregroundLayer, playerReference, position, "Broken Door", "", textStyle, monologuesList );
    }
}

//has no dialogue, just starts the boss scene
class BossWarp extends Npc{

    drawLayers = null;

    constructor(container, drawLayers, playerReference, position){
        const monologuesList= [
            ""
        ]


        super (container, drawLayers.foregroundLayer, playerReference, position, "Boss Warp", "", undefined,monologuesList);

        this.drawLayers=  drawLayers;

    }

    isInteracted(){
        mainGame.changeScene(new BossScene(this.drawLayers));
    }
}