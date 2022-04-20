class NameInputScene{

    drawLayers= null;
    game = null;

    backgroundGraphics = null;

    lettersFont = undefined;
    nameFont = undefined;

    nameTextBox = null;

    letterTextBoxes = []
    letters = "azertyuiopqsdfghjklmwxcvbn";
    lineSize = 10;

    currentMaxColumn = 10;
    currentCursorRow = 0;
    currentCursorColumn = 0;
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

        })

        this.nameFont = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 50,
            fontWeight : "bold",
            fill : "#ff0000",
        })


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

            if (this.currentCursorRow === Math.ceil(this.letters.length / this.lineSize)){
                this.currentCursorRow = 0;
            }

            this.currentMaxColumn = (this.letters.length - this.currentCursorRow * this.lineSize > this.lineSize) ? this.lineSize : (this.letters.length - this.currentCursorRow * this.lineSize);
            
            if (this.currentCursorColumn > this.currentMaxColumn - 1){
                this.currentCursorColumn = this.currentMaxColumn - 1;
            }

            this.updateCursorPosition();
        }
        else if (inputs.up.isJustDown || inputs.upAlt.isJustDown){
            this.currentCursorRow -= 1;

            if (this.currentCursorRow === -1){
                this.currentCursorRow = Math.ceil(this.letters.length / this.lineSize) - 1;
            }

            this.currentMaxColumn = (this.letters.length - this.currentCursorRow * this.lineSize > this.lineSize) ? this.lineSize : (this.letters.length - this.currentCursorRow * this.lineSize);
            
            if (this.currentCursorColumn > this.currentMaxColumn - 1){
                this.currentCursorColumn = this.currentMaxColumn - 1;
            }
            
            this.updateCursorPosition();
        }


        //check if one of the letters is actually selected
        if (inputs.enter.isJustDown){
            this.currentName += this.letters[this.currentCursorRow * this.lineSize + this.currentCursorColumn];
        }


        //update the name text box 
        this.nameTextBox.setText(this.currentName);
        this.nameTextBox.centerHorizontallyAt(400);

    }

    updateCursorPosition(){
        //use cursor row and cursor column to find the position of the current letter
        const index = this.lineSize * this.currentCursorRow + this.currentCursorColumn;

        console.log(index);

        const position = this.getLetterPosition(this.currentCursorRow, this.currentCursorColumn);
        const dimensions = this.letterTextBoxes[index].getDimensions();

        this.cursor.clear();
        this.cursor.beginFill(0xFFFFFF);
        this.cursor.drawRect(position.x - dimensions.width/2, position.y - dimensions.height/2, dimensions.width, dimensions.height);
    }

    destroy(){
        
    }


}