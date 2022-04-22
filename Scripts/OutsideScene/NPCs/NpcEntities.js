class BrokenDoor extends Npc{

    monologuesList = [
        ["This door doesn't seem to open...",
    "Perhaps you should come back later..."]
    ];

    currentMonologueIndex =0;

    textStyle = new PIXI.TextStyle({
        fontFamily : "BrokenConsole",
        fontSize : 24,
        fontWeight : "bold",
        fill : "#ffffff",
        stroke : "#ffffff",
    });

    constructor(container, playerReference, position){
        super(container, playerReference );

        this.x = position.x;
        this.y = position.y;

        this.setupDebugGraphics();
    }


    isInteracted(){
        //advance the dialogue tree
        this.currentMonologueIndex = Math.min(this.currentMonologueIndex + 1, this.monologuesList.length - 1);

        //determin whether the player is in the lower half or upper half of the screen
        const verticalOffset= (this.playerReference.y > 300) ? 1 : 0

        return new Monologue(drawLayers.foregroundLayer, this.monologuesList[this.currentMonologueIndex], this.textStyle,
            "Broken Door", verticalOffset);
        
    }
}

class BossWarp extends Npc{


    constructor(container,  playerReference, position){
        super(container, playerReference);

        this.x = position.x;
        this.y = position.y;

        this.setupDebugGraphics();
    }

    isInteracted(){
        console.log("BOSS !");
        return null;

        //mainGame.changeScene(new BossScene(patternsList ));
    }
}



