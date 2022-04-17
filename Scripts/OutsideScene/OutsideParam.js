class OutsideParam{

    //the matrix that represents the outside map
    //every room is 800x600 px to take up the entire screen
    mapMatrix = null;
    startingRoomPosition = {x:0, y:0};
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

        //start the player off at the middle of the room
        this.playerReference = new Character(this.drawLayers, {x:400, y:300});
    }

    update(delta, inputs){
        //update the player's position
        this.playerReference.update(delta, inputs);

        //check if the player went into a collision this frame to readjust him
        const playerHitbox = this.playerReference.getHitboxRectangle();

        for(let rectangle of this.borderRectangles){
            
        }
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
            this.drawLayers.activeLayer.addChild(rectangle.getGraphics(0xFF0000));
        }



    }

}