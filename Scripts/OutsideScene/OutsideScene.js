class OutsideScene{

    //the matrix that represents the outside map
    //every room is 800x600 px to take up the entire screen
    mapMatrix = null;
    startingRoomPosition = {x:0, y:0};
    currentRoomPosition = {x:0, y:0};
    borderRectangles = [];
    borderHue = "";

    //container for camera behavior
    //initially center at the middle of the starting room "2"
    container = null;

    //destroy flag
    destroying = false;

    //the player
    playerReference = null;

    npcList = [];


    borderAlpha = 1;
    //no required assets since this is a virtual class
    requiredAssets = {

    };


    //takes no arguments and is instead configured with methods
    constructor(borderHue = "0xFF0000"){
        // PIXI.Loader.shared.add("God Spritesheet", "Sprites/God.json");
        // PIXI.Loader.shared.add("Rock", "Sprites/Rock.png");
        // PIXI.Loader.shared.add("Shield",  "Sprites/Shield.png");
        // PIXI.Loader.shared.load(() => this.load(this));

        this.borderHue = borderHue;
        

    }


    //called after the ressources are loaded into the pixi loader
    load(background=null){

        //create a few entity containers for camera purposes
        this.backgroundContainer = new PIXI.Container();
        if (background != null){
            this.backgroundContainer.addChild(background);
            this.background = background;
        }
        drawLayers.activeLayer.addChild(this.backgroundContainer);

        this.container = new PIXI.Container();
        drawLayers.activeLayer.addChild(this.container);

        this.characterContainer = new PIXI.Container();
        drawLayers.activeLayer.addChild(this.characterContainer);

        this.foregroundContainer = new PIXI.Container();
        drawLayers.activeLayer.addChild(this.foregroundContainer);



        //start the player off at the middle of the room
        this.playerReference = new Character({x:400, y:300}, this.characterContainer);

    }



    getPossibleDirections(matrixCoords){
        const possibleDirections = {canGoLeft : false, canGoRight :false, canGoDown :false, canGoUp :false,
                                    canGoUpLeft :false, canGoUpRight :false, canGoDownLeft :false, canGoDownRight :false};


        //camera shouldn't move if you're OOB
        if (this.mapMatrix[matrixCoords.y] == undefined){
            return possibleDirections;
        }
        if (this.mapMatrix[matrixCoords.y][matrixCoords.x] == undefined){
            return possibleDirections;
        }


        //check the cardinal directions
        possibleDirections.canGoLeft = !(this.mapMatrix[matrixCoords.y][matrixCoords.x - 1] === undefined);
        if (possibleDirections.canGoLeft){
            possibleDirections.canGoLeft = !(this.mapMatrix[matrixCoords.y][matrixCoords.x - 1] === 0);
        } 


        possibleDirections.canGoRight = !(this.mapMatrix[matrixCoords.y][matrixCoords.x + 1] === undefined);
        if (possibleDirections.canGoRight){
            possibleDirections.canGoRight = !(this.mapMatrix[matrixCoords.y][matrixCoords.x + 1] === 0);
        }


        possibleDirections.canGoUp =  !(this.mapMatrix[matrixCoords.y - 1] === undefined);
        if (possibleDirections.canGoUp){
            possibleDirections.canGoUp = !(this.mapMatrix[matrixCoords.y - 1][matrixCoords.x] === 0);

        }

        possibleDirections.canGoDown = !(this.mapMatrix[matrixCoords.y + 1] === undefined);
        if (possibleDirections.canGoDown){
            possibleDirections.canGoDown = !(this.mapMatrix[matrixCoords.y + 1][matrixCoords.x] === 0);
        }   

        //check the diagonal directions
        if (possibleDirections.canGoUp && possibleDirections.canGoLeft){
            possibleDirections.canGoUpLeft = !(this.mapMatrix[matrixCoords.y - 1][matrixCoords.x- 1] === 0);
        }
        if (possibleDirections.canGoUp && possibleDirections.canGoRight){
            possibleDirections.canGoUpRight = !(this.mapMatrix[matrixCoords.y - 1][matrixCoords.x+ 1] === 0);
        }
        if (possibleDirections.canGoDown && possibleDirections.canGoLeft){
            possibleDirections.canGoDownLeft = !(this.mapMatrix[matrixCoords.y + 1][matrixCoords.x- 1] === 0);
        }
        if (possibleDirections.canGoDown && possibleDirections.canGoRight){
            possibleDirections.canGoDownRight = !(this.mapMatrix[matrixCoords.y + 1][matrixCoords.x+ 1] === 0);
        }

        

        return possibleDirections;

    }

    update(delta, inputs){

 


        //update the player's position
        this.playerReference.update(delta, inputs);


        //update the broken door 
        for (let npc of this.npcList){
            npc.update(delta, inputs);
        }

        
        if (this.destroying){
            return;
        }

        //check if the player went into a collision with a border rectangle this frame to readjust him
        let playerHitbox = this.playerReference.getHitboxRectangle();

        for(let rectangle of this.borderRectangles){
            if (playerHitbox.isColliding(rectangle)){
                const oldPlayerHitbox = this.playerReference.getOldHitboxRectangle();
                const newPlayerPosition = rectangle.simulateCollision(oldPlayerHitbox, playerHitbox);

                playerHitbox = newPlayerPosition;
            }
        }

        //check if the player went into a collision with an npc to readjust him
        for (let npc of this.npcList){
            if (npc.hitbox !== null){
                if (!npc.destroyed){
                    if (playerHitbox.isColliding(npc.hitbox)){
                        const oldPlayerHitbox = this.playerReference.getOldHitboxRectangle();
                        const newPlayerHitbox = npc.hitbox.simulateCollision(oldPlayerHitbox, playerHitbox);
    
                        playerHitbox = newPlayerHitbox;
                    }
                }

            }    
        }

        //update the player's position after collisions
        this.playerReference.setHitboxRectangle(playerHitbox);


        

        //update the camera with the correct position for the main container
        this.container.x = 400 - this.playerReference.x;
        this.container.y = 300 - this.playerReference.y;

        


        //DO NOT allow the camera to go outside of the borders
        this.currentRoomPosition.x = this.startingRoomPosition.x + Math.floor(this.playerReference.x / 800);
        this.currentRoomPosition.y = this.startingRoomPosition.y + Math.floor(this.playerReference.y / 600);

        //get the possible directions to know where the camera can move
        const possibleDirections = this.getPossibleDirections({x: this.currentRoomPosition.x, y: this.currentRoomPosition.y});


        //bound the camera accordingly
        const relativeRoomX = this.currentRoomPosition.x - this.startingRoomPosition.x;
        const relativeRoomY = this.currentRoomPosition.y - this.startingRoomPosition.y;

        if (!possibleDirections.canGoLeft){
            if (this.container.x > relativeRoomX * -800){
                this.container.x = relativeRoomX * -800;
            }
        }
        if (!possibleDirections.canGoRight){
            if (this.container.x - 800 < -800 * (relativeRoomX + 1)){
                this.container.x = relativeRoomX * -800;
            }
        }
        if (!possibleDirections.canGoDown){
            if (this.container.y - 600 < -600 * (relativeRoomY + 1)){
                this.container.y = relativeRoomY * -600;
            }
        }
        if (!possibleDirections.canGoUp){
            if (this.container.y  > -600 * relativeRoomY){
                this.container.y = relativeRoomY * -600;
            }
        }

        //constrain the other two containers to copy the main container
        this.backgroundContainer.x = this.container.x;
        this.backgroundContainer.y = this.container.y;

        this.characterContainer.x = this.container.x;
        this.characterContainer.y = this.container.y;

        this.foregroundContainer.x = this.container.x;
        this.foregroundContainer.y = this.container.y;

        

        // //get the displacements of the player from the center of the room
        // const xDisplacement = Math.abs(this.playerReference.x - (relativeRoomX * 800 + 400)) ; 
        // const yDisplacement = Math.abs(this.playerReference.y - (relativeRoomY * 600 + 300));

        //THIS HANDLES DIAGONAL CAMERA SHENANIGANS
        // if (!possibleDirections.canGoUpLeft){    
        //     //if horizontal displacement wins out over vertical displacement use vertical camera bound
        //     if (xDisplacement > yDisplacement){
        //         if (this.container.y  > -600 * relativeRoomY){
        //             this.container.y = relativeRoomY * -600;
        //         }
        //     }
        //     else{
        //         if (this.container.x > relativeRoomX * -800){
        //             this.container.x = relativeRoomX * -800;
        //         }
        //     }

        // }
        
        // if (!possibleDirections.canGoUpRight){    
        //     //if horizontal displacement wins out over vertical displacement use vertical camera bound
        //     if (xDisplacement > yDisplacement){
        //         if (this.container.y  > -600 * relativeRoomY){
        //             this.container.y = relativeRoomY * -600;
        //         }
        //     }
        //     else{
        //         if (this.container.x - 800 < -800 * (relativeRoomX + 1)){
        //             this.container.x = relativeRoomX * -800;
        //         }
        //     }

        // }
        
        // if (!possibleDirections.canGoDownLeft){    
        //     //if horizontal displacement wins out over vertical displacement use vertical camera bound
        //     if (xDisplacement > yDisplacement){
        //         if (this.container.y - 600 < -600 * (relativeRoomY + 1)){
        //             this.container.y = relativeRoomY * -600;
        //         }
        //     }
        //     else{
        //         if (this.container.x > relativeRoomX * -800){
        //             this.container.x = relativeRoomX * -800;
        //         }
        //     }

        // }
        
        // if (!possibleDirections.canGoDownRight){    
        //     //if horizontal displacement wins out over vertical displacement use vertical camera bound
        //     if (xDisplacement > yDisplacement){
        //         if (this.container.y - 600 < -600 * (relativeRoomY + 1)){
        //             this.container.y = relativeRoomY * -600;
        //         }
        //     }
        //     else{
        //         if (this.container.x - 800 < -800 * (relativeRoomX + 1)){
        //             this.container.x = relativeRoomX * -800;
        //         }
        //     }

        // }


 
        //console.log("LEFT : " + canGoLeft + " / RIGHT : " + canGoRight + "/ UP : " + canGoUp + "/ DOWN : " + canGoDown);
    }

    setMapMatrix(matrix){
        this.mapMatrix = matrix;



        //first, find the array position of the starting room marked by a "2"
        for (let y = 0; y < this.mapMatrix.length; y++){
            for (let x = 0; x < this.mapMatrix[0].length; x++){
                
                //set it and leave the loop
                if(this.mapMatrix[y][x] == 2){
                    this.startingRoomPosition.y = y;
                    this.startingRoomPosition.x = x;
                    break;
                } 

            }
        }
        

        //create a list of border rectangles around every single room
        for (let y = 0; y < this.mapMatrix.length; y++){
            for (let x = 0; x < this.mapMatrix[0].length; x++){
                let currentCell = this.mapMatrix[y][x];

                //only create borders around 1s or 2s that are surrounded with 0s
                if (currentCell === 1 || currentCell == 2){
                    const yOffset = y - this.startingRoomPosition.y;
                    const xOffset = x - this.startingRoomPosition.x;

                    //verify the neighboring cells
                    //check the cell above
                    if (this.mapMatrix[y-1] == undefined || this.mapMatrix[y-1][x] == 0){
                        //make a rectangle on top of this cell
                        const borderX = 800 * xOffset;
                        const borderY = 600 * yOffset;

                        this.borderRectangles.push(new Rectangle(borderX, borderY, 800, 5));
                    }
                    //check the cell below
                    if (this.mapMatrix[y+1] == undefined ||this.mapMatrix[y+1][x] == 0){
                        const borderX = 800 * xOffset;
                        const borderY = 600 * (yOffset + 1) - 5;
                        
                        this.borderRectangles.push(new Rectangle(borderX, borderY, 800, 5))
                    }
                    //check the cell to the left
                    if (this.mapMatrix[y][x-1] == undefined ||this.mapMatrix[y][x-1] == 0){
                        const borderX = 800 * xOffset;
                        const borderY = 600 * yOffset;

                        this.borderRectangles.push(new Rectangle(borderX, borderY, 5, 600));
                    }
                    //check the cell to the right
                    if (this.mapMatrix[y][x+1] == undefined ||this.mapMatrix[y][x+1] == 0){
                        const borderX = 800 * (xOffset + 1) - 5;
                        const borderY = 600 * yOffset;

                        this.borderRectangles.push(new Rectangle(borderX, borderY, 5, 600));
                    }



                }
            }
        }


        //display the bounding rectangles for debug purposes
        for(let rectangle of this.borderRectangles){
            this.container.addChild(rectangle.getGraphics(this.borderHue, this.borderAlpha));
        }



    }

    destroy(){
        //destroy everything contained in the container
        this.destroying = true;

        this.playerReference.destroy();


        while (this.container.children[0]){
            this.container.removeChild(this.container.children[0]);
        }


        this.container.destroy();
    }

}