class NameInputScene{

    drawLayers= null;
    game = null;

    elapsedTime = 0;

    backgroundGraphics = null;

    lettersFont = undefined;
    specialKeyFont = undefined;
    nameFont = undefined;

    nameTextBox = null;

    qwertyButton = null;
    enterButton = null;
    undoButton = null;
    specialKeyRows = 2;

    letterTextBoxes = []
    letters = "azertyuiopqsdfghjklmwxcvbn";
    lineSize = 10;

    currentMaxColumn = 10;
    currentCursorRow = 0;
    currentCursorColumn = 0;
    currentCursorSpecialPosition = 0; //either 0 for keyboard, 1 for qwerty key, 2 for undo key, 3 for enter key

    cursor = null;

    currentName = "";

    constructor(drawLayers){
        //assign instance members
        this.drawLayers = drawLayers;

        //create a background graphics
        this.backgroundGraphics= new PIXI.Graphics();

        this.backgroundGraphics.beginFill(0x000000);
        this.backgroundGraphics.drawRect(0, 0, 800, 600);

        this.drawLayers.backgroundLayer.addChild(this.backgroundGraphics);


        //instantiate the cursor 
        this.cursor = new PIXI.Graphics();

        this.drawLayers.foregroundLayer.addChild(this.cursor);




        //create all of the text display with all of the letters
        this.lettersFont = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 50,
            fontWeight : "bold",
            fill : "#ffffff",

        });

        this.specialKeyFont = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 50,
            fontWeight : "bold",
            fill : "#3240a8",

        });

        this.nameFont = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 50,
            fontWeight : "bold",
            fill : "#ff0000",
        });




        //create a text box to display the currently chosen name 
        this.nameTextBox = new TextDisplay(this.drawLayers.activeLayer, this.currentName, {x:0,y:0}, this.nameFont);
        this.nameTextBox.centerHorizontallyAt(400);
        this.nameTextBox.centerVerticallyAt(100);

        //create all of the text boxes for the keyboard
        for(let i = 0; i< this.letters.length; i++){

            let currentRow = Math.floor(i / this.lineSize); 
            let currentColumn = i%10;
            const position = this.getLetterPosition(currentRow, currentColumn);

            this.letterTextBoxes.push(new TextDisplay(this.drawLayers.activeLayer, this.letters[i], 
                {x: 0, y : 0}, this.lettersFont ) );

            
            this.letterTextBoxes[i].centerHorizontallyAt(position.x);
            this.letterTextBoxes[i].centerVerticallyAt(position.y);
        }

        //create a text box for the qwerty layout button
        this.qwertyButton = new TextDisplay(this.drawLayers.activeLayer, "QWERTY", {x:0,y:0}, this.specialKeyFont);
        this.qwertyButton.centerHorizontallyAt(200);
        this.qwertyButton.centerVerticallyAt(480);

        //create a text box for the undo button
        this.undoButton = new TextDisplay(this.drawLayers.activeLayer, "UNDO", {x:0,y:0}, this.specialKeyFont);
        this.undoButton.centerHorizontallyAt(600);
        this.undoButton.centerVerticallyAt(480);

        //create a text box for the enter button at the very bottom of the screen
        this.enterButton = new TextDisplay(this.drawLayers.activeLayer, "ENTER", {x:0,y:0}, this.specialKeyFont);
        this.enterButton.centerHorizontallyAt(400);
        this.enterButton.centerVerticallyAt(540);

        //initiliaze the cursor at its position
        this.updateCursorPosition();


    }

    //returns the center position of a letter based on its row and column index
    getLetterPosition(row, column){
        const position = {x:0, y:0};

        let numRowElements = (this.letters.length - row * this.lineSize > this.lineSize) ? this.lineSize : this.letters.length - row * this.lineSize;
        let columnSpacing = 600 / (numRowElements + 1);

        position.x = 100 + (column + 1) * columnSpacing;
        position.y = 200 + row * 100;

        return position;
    }

    update(delta, inputs){
        //keep track of time internally
        this.elapsedTime += delta;

        //update the current column based on left/right inputs
        if (inputs.left.isJustDown || inputs.leftAlt.isJustDown){
            this.currentCursorColumn -= 1;
            
            if (this.currentCursorColumn === -1){
                this.currentCursorColumn = this.currentMaxColumn - 1;
            }

            this.updateCursorPosition();
        }
        else if (inputs.right.isJustDown){
            this.currentCursorColumn += 1;

            if (this.currentCursorColumn === this.currentMaxColumn){
                this.currentCursorColumn = 0;
            }

            this.updateCursorPosition();
        }


        //update the current row and max colmun based on up/down inputs
        if (inputs.down.isJustDown){
            this.currentCursorRow += 1;



            if (this.currentCursorRow === Math.ceil(this.letters.length / this.lineSize) + this.specialKeyRows){
                this.currentCursorRow = 0;
            }

            //two different methods of calculating the max row
            let newMaxColumn = 0;
            if (this.currentCursorRow <= Math.ceil(this.letters.length / this.lineSize) - 1){
                newMaxColumn = (this.letters.length - this.currentCursorRow * this.lineSize > this.lineSize) ? this.lineSize : (this.letters.length - this.currentCursorRow * this.lineSize);
            }
            else{
                console.log("GOING DOWN");
                newMaxColumn = (this.currentCursorRow - Math.ceil(this.letters.length / this.lineSize) === 0) ? 2 : 1;
            }

            this.currentCursorColumn = Math.floor((this.currentCursorColumn / this.currentMaxColumn) * newMaxColumn);
            this.currentMaxColumn = newMaxColumn;
            


            this.updateCursorPosition();
        }
        else if (inputs.up.isJustDown || inputs.upAlt.isJustDown){
            this.currentCursorRow -= 1;

            if (this.currentCursorRow === -1){
                this.currentCursorRow = Math.ceil(this.letters.length / this.lineSize) + 1;
            }

            let newMaxColumn = 0;
            if (this.currentCursorRow <= Math.ceil(this.letters.length / this.lineSize) - 1){
                newMaxColumn = (this.letters.length - this.currentCursorRow * this.lineSize > this.lineSize) ? this.lineSize : (this.letters.length - this.currentCursorRow * this.lineSize);
            }
            else{
                newMaxColumn = (this.currentCursorRow - Math.ceil(this.letters.length / this.lineSize) === 0) ? 2 : 1;
            }

            this.currentCursorColumn = Math.floor((this.currentCursorColumn / this.currentMaxColumn) * newMaxColumn);
            this.currentMaxColumn = newMaxColumn;       
            
            

            
            this.updateCursorPosition();
        }

        //DEBUG 
        console.log("ROW : " + this.currentCursorRow + " COLUMN : " + this.currentCursorColumn + " MAX COLUMN : " + this.currentMaxColumn);


        //check if one of the letters is actually selected
        if (inputs.enter.isJustDown){
            this.currentName += this.letters[this.currentCursorRow * this.lineSize + this.currentCursorColumn];
        }


        //update the name text box 
        this.nameTextBox.setText(this.currentName);
        this.nameTextBox.centerHorizontallyAt(400);

        //make cursor fade in and out with max opacity of 0.7
        this.cursor.alpha = Math.min(Math.abs(Math.cos(4 * this.elapsedTime)), 0.7);

    }

    updateCursorPosition(){
        //use cursor row and cursor column to find the position of the current letter
        const index = this.lineSize * this.currentCursorRow + this.currentCursorColumn;

        let position = {x : 0, y:0};
        let dimensions = {width : 0, height:0};

        if (index < this.letters.length){
            position = this.getLetterPosition(this.currentCursorRow, this.currentCursorColumn);
            dimensions = this.letterTextBoxes[index].getDimensions();
    

        }
        else{
            //have one case for each special letter ig 
            const id = 2* (this.currentCursorRow - 3) + this.currentCursorColumn;

            if (id=== 0){ //qwerty button
                position = this.qwertyButton.getCenterPosition();
                dimensions = this.qwertyButton.getDimensions();

            }  
            else if (id === 1) { //undo button
                position = this.undoButton.getCenterPosition();
                dimensions = this.undoButton.getDimensions();
            }
            else if (id === 2){ //enter button
                position = this.enterButton.getCenterPosition();
                dimensions = this.enterButton.getDimensions();
            }
        }

        this.cursor.clear();
        this.cursor.beginFill(0xFFFFFF);
        this.cursor.drawRect(position.x - dimensions.width/2 - 2, position.y - dimensions.height/2, dimensions.width + 4, dimensions.height - 4);
 

   }

    destroy(){
        
    }


}