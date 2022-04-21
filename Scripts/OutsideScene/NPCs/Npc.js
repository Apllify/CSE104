class Npc{

    x = 0;
    y = 0;

    drawLayer = null;
    foregroundLayer =null;
    playerReference = null;

    name = "";
    spritePath = "";

    textStyle = undefined;

    monologuesList = [
        ["This is my first time talking to you",
    "Pretty cool right ?"],
        ["This is my second time talking to you !",
    "There is no more dialogue after this "],
        ["Uhmmm, nothing to see here..."]
    ]
    currentMonologueIndex = -1;
    currentMonologue = null;
    isMonologuing = false;
    interactionRadius = 70;

    //temporary display rectangle 
    rectangle = null;

    //state variable
    destroyed = false;

    constructor(drawLayer, foregroundLayer, playerReference,  position, name, spritePath, textStyle, monologuesList ){
        this.drawLayer  =drawLayer;
        this.foregroundLayer = foregroundLayer;

        this.playerReference=  playerReference;

        this.name = name;

        this.x = position.x;
        this.y = position.y;

        this.spritePath = spritePath;
        this.textStyle = textStyle;

        this.monologuesList = monologuesList;

        //create a temporary display rectangle
        this.rectangle = new Rectangle(this.x - 20, this.y - 20, 40, 40).getGraphics(0x00FF00);
        this.drawLayer.addChild(this.rectangle);
    }


    update(delta, inputs){
        //don't update if the entity is destroyed
        if (this.destroyed){
            return;
        }


        //check the distance with the player to check if the next monologue sequence can be engaged
        if (!this.isMonologuing){
            if (inputs.enter.isJustDown){
                const xDistance=  this.playerReference.x - this.x;
                const yDistance = this.playerReference.y - this.y;
                const totalDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance , 2));
    
    
                if (totalDistance < this.interactionRadius ){
                    //start the next monologue
                    this.isInteracted();
                }
            }

        }
        else{
            this.currentMonologue.update(delta, inputs)

            if (this.currentMonologue.isDone()){
                this.isMonologuing = false;
            }
        }  
    }

    //called whenever the player interacts with the npc, made to be overriden
    isInteracted(){
        this.nextMonologue();
    }

    nextMonologue(){
        this.currentMonologueIndex = Math.min(this.currentMonologueIndex + 1, this.monologuesList.length -1);
        this.isMonologuing = true;

        const verticalOffset = (this.playerReference.y < 450) ? 1 : 0;
        this.currentMonologue = new Monologue(this.foregroundLayer,this.monologuesList[this.currentMonologueIndex],
            this.textStyle, this.name, verticalOffset);    
    }
    
    destroy(){
        this.rectangle.destroy();
        this.destroyed = true;
        delete this;
    }
}