class BossScene{                // First Scene in PLAY. Creates a player. 
    constructor(drawLayers){
        this.player = new Character(drawLayers);
    }
    update(delta, inputs){
        this.player.update(delta, inputs);
    }
}