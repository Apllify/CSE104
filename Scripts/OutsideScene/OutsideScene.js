class OutsideScene{

    //the matrix that represents the outside map
    //every room is 800x600 px to take up the entire screen
    mapMatrix = null;
    startingRoomPosition = {x:0, y:0};
    currentRoomPosition = {x:0, y:0};
    borderRectangles = [];

    //container for camera behavior
    //initially center at the middle of the starting room "2"
    drawLayers = null;
    container = null;

    //the player
    playerReference = null;

    //DEBUG
    monologue = null;

    //takes no arguments and is instead configured with methods
    constructor(drawLayers){

        this.drawLayers = drawLayers;
        this.container = new PIXI.Container();
        this.drawLayers.activeLayer.addChild(this.container);

        //start the player off at the middle of the room
        this.playerReference = new Character(this.drawLayers, {x:400, y:300}, this.container);

        //DEBUG
        const dialogueFontStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 28,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        this.monologue = new Monologue(this.drawLayers.foregroundLayer, ["Heh, this is a test dialogue", "Looks like it works somehow ????", "hehehhehe\ndhdhdhdhdh"], dialogueFontStyle, "Albert", 0);
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

        //DEBUG
        this.monologue.update(delta, inputs);

        //update the player's position
        this.playerReference.update(delta, inputs);

        //check if the player went into a collision this frame to readjust him
        let playerHitbox = this.playerReference.getHitboxRectangle();

        for(let rectangle of this.borderRectangles){
            if (playerHitbox.isColliding(rectangle)){
                const oldPlayerHitbox = this.playerReference.getOldHitboxRectangle();
                const newPlayerPosition = rectangle.simulateCollision(oldPlayerHitbox, playerHitbox);

                playerHitbox = newPlayerPosition;
            }
        }

        this.playerReference.setHitboxRectangle(playerHitbox);


        //update the camera with the correct position to account for player movements
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
            this.container.addChild(rectangle.getGraphics(0xFF0000));
        }



    }

}