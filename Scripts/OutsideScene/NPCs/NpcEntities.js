class BrokenDoor extends Npc{

    constructor(container, playerReference, position){
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


    constructor(container,  playerReference, position){
        const monologuesList= [
            ""
        ]


        super (container, drawLayers.foregroundLayer, playerReference, position, "Boss Warp", "", undefined,monologuesList);


    }

    isInteracted(){
        const patternsList = [
            (drawLayer, player, difficulty) => new FourCornerWaves(drawLayer, player, difficulty),
            (drawLayer, player, difficulty) => new PacmanWithWave(drawLayer, player, difficulty),
            (drawLayer, player, difficulty) => new PacmanSquare(drawLayer, player, difficulty)

        ];


        mainGame.changeScene(new BossScene(patternsList ));
    }
}



class BossEntry extends Npc{


    constructor(drawLayer, foregroundLayer, playerReference,  position, name, spritePath,
        scene){
        super(drawLayer, foregroundLayer, playerReference, position, name, spritePath, null)
        this.bossScene = bossScene;
    }

    isInteracted(){
        mainGame.changeScene(this.bossScene);
    }

    nextMonologue(){
        // just in case it is called 
        return;
    }


}
