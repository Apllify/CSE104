class BarScene extends OutsideScene{
    requiredAssets = {
        "Shield":  "Sprites/Shield.png",
        "Chair": "Sprites/Chair.png"

    }

    constructor(){
        super(0x7d4a28);
    }


    load(){
        super.load();

        this.setMapMatrix([[1, 1],[1, 2]]);

    }


    update(delta, inputs){
        super.update(delta, inputs);
    }

    destroy(){
        super.destroy();
    }

}