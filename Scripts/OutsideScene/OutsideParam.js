class OutsideParam{

    //the matrix that represents the outside map
    //every room is 800x600 px to take up the entire screen
    mapMatrix = null;
    borderRectangles = [];

    //container for camera behavior
    //initially center at the middle of the starting room "2"
    container = null;

    //takes no arguments and is instead configured with methods
    constructor(){
        this.container = new PIXI.Container();
    }

    setMapMatrix(matrix){
        this.mapMatrix = matrix;

        //first, find the position of the center cell
        

        //create a list of border rectangles around every single room
        for (let y = 0; y < this.mapMatrix.length; y++){
            for (let x = 0; x < this.mapMatrix[0].length; x++){
                let currentCell = this.mapMatrix[y][x];

                if (currentCell === 1 || currentCell == 2){

                }
            }
        }
    }

}