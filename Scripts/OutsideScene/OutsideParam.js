class OutsideParam{

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

    //takes no arguments and is instead configured with methods
    constructor(drawLayers){

        this.drawLayers = drawLayers;
        this.container = new PIXI.Container();
        this.drawLayers.activeLayer.addChild(this.container);

        //start the player off at the middle of the room
        this.playerReference = new Character(this.drawLayers, {x:400, y:300}, this.container);
    }

    update(delta, inputs){
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

        console.log("X : " + this.currentRoomPosition.x + "Y : " + this.currentRoomPosition.y);

        let canGoLeft = !(this.mapMatrix[this.currentRoomPosition.y][this.currentRoomPosition.x - 1] === undefined);
        if (canGoLeft){
            canGoLeft = !(this.mapMatrix[this.currentRoomPosition.y][this.currentRoomPosition.x - 1] === 0);
        } 


        let canGoRight = !(this.mapMatrix[this.currentRoomPosition.y][this.currentRoomPosition.x + 1] === undefined);
        if (canGoRight){
            canGoRight = !(this.mapMatrix[this.currentRoomPosition.y][this.currentRoomPosition.x + 1] === 0);
        }


        let canGoUp =  !(this.mapMatrix[this.currentRoomPosition.y - 1] === undefined);
        if (canGoUp){
            canGoUp =  !(this.mapMatrix[this.currentRoomPosition.y - 1][this.currentRoomPosition.x] === 0);
        }

        let canGoDown = !(this.mapMatrix[this.currentRoomPosition.y + 1] === undefined);
        if (canGoDown){
            canGoDown = !(this.mapMatrix[this.currentRoomPosition.y + 1][this.currentRoomPosition.x] === 0);
        }   

 
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

                        this.borderRectangles.push(new Rectangle(borderX, borderY, 800, 1));
                    }
                    //check the cell below
                    if (this.mapMatrix[y+1] == undefined ||this.mapMatrix[y+1][x] == 0){
                        const borderX = 800 * xOffset;
                        const borderY = 600 * (yOffset + 1) - 1;
                        
                        this.borderRectangles.push(new Rectangle(borderX, borderY, 800, 1))
                    }
                    //check the cell to the left
                    if (this.mapMatrix[y][x-1] == undefined ||this.mapMatrix[y][x-1] == 0){
                        const borderX = 800 * xOffset;
                        const borderY = 600 * yOffset;

                        this.borderRectangles.push(new Rectangle(borderX, borderY, 1, 600));
                    }
                    //check the cell to the right
                    if (this.mapMatrix[y][x+1] == undefined ||this.mapMatrix[y][x+1] == 0){
                        const borderX = 800 * (xOffset + 1) - 1;
                        const borderY = 600 * yOffset;

                        this.borderRectangles.push(new Rectangle(borderX, borderY, 1, 600));
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