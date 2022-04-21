class BrokenDoor extends Npc{

    constructor(drawLayer, foregroundLayer, playerReference, position){
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
        

        super(drawLayer, foregroundLayer, playerReference, position, "Broken Door", "", textStyle, monologuesList );
    }
}