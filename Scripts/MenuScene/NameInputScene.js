class NameInputScene{

    game = null;

    elapsedTime = 0;
    destroying = false;

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

    constructor(){

        //create a background graphics
        this.backgroundGraphics= new PIXI.Graphics();

        this.backgroundGraphics.beginFill(0x000000);
        this.backgroundGraphics.drawRect(0, 0, 800, 600);

        drawLayers.backgroundLayer.addChild(this.backgroundGraphics);

        //add a few sound effects for this scene
        PIXI.sound.add('flipKeyboard', '././Sound/flip_keyboard.wav');
        PIXI.sound.add("startGame", "././Sound/start_game.wav");

        PIXI.sound.volume("flipKeyboard" ,0.03);
        PIXI.sound.volume("startGame", 0.5);




        //instantiate the cursor 
        this.cursor = new PIXI.Graphics();

        drawLayers.foregroundLayer.addChild(this.cursor);




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
        this.nameTextBox = new TextDisplay(drawLayers.activeLayer, this.currentName, {x:0,y:0}, this.nameFont);
        this.nameTextBox.centerHorizontallyAt(400);
        this.nameTextBox.centerVerticallyAt(100);

        //setup the keyboard 
        this.setupKeyboard();



        //create a text box for the qwerty layout button
        this.qwertyButton = new TextDisplay(drawLayers.activeLayer, "QWERTY", {x:0,y:0}, this.specialKeyFont);
        this.qwertyButton.centerHorizontallyAt(200);
        this.qwertyButton.centerVerticallyAt(480);

        //create a text box for the undo button
        this.undoButton = new TextDisplay(drawLayers.activeLayer, "UNDO", {x:0,y:0}, this.specialKeyFont);
        this.undoButton.centerHorizontallyAt(600);
        this.undoButton.centerVerticallyAt(480);

        //create a text box for the enter button at the very bottom of the screen
        this.enterButton = new TextDisplay(drawLayers.activeLayer, "ENTER", {x:0,y:0}, this.specialKeyFont);
        this.enterButton.centerHorizontallyAt(400);
        this.enterButton.centerVerticallyAt(540);

        //initiliaze the cursor at its position
        this.updateCursorPosition();


    }
    
    setupKeyboard(){

        //clear the keyboard if necessary first
        for (let i =0; i<this.letterTextBoxes.length; i++){
            this.letterTextBoxes[i].destroy();

        }

        this.letterTextBoxes = [];


        //create all of the text boxes for the keyboard
        for(let i = 0; i< this.letters.length; i++){

            let currentRow = Math.floor(i / this.lineSize); 
            let currentColumn = i%10;
            const position = this.getLetterPosition(currentRow, currentColumn);

            this.letterTextBoxes.push(new TextDisplay(drawLayers.activeLayer, this.letters[i], 
                {x: 0, y : 0}, this.lettersFont ) );

            
            this.letterTextBoxes[i].centerHorizontallyAt(position.x);
            this.letterTextBoxes[i].centerVerticallyAt(position.y);
        }
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
        if (this.destroying){
            return;
        }

        //keep track of time internally
        this.elapsedTime += delta;

        //update the current column based on left/right inputs
        if (inputs.left.isJustDown || inputs.leftAlt.isJustDown){
            PIXI.sound.play('flip')

            this.currentCursorColumn -= 1;
            
            if (this.currentCursorColumn === -1){
                this.currentCursorColumn = this.currentMaxColumn - 1;
            }

            this.updateCursorPosition();
        }
        else if (inputs.right.isJustDown){
            PIXI.sound.play('flip')

            this.currentCursorColumn += 1;

            if (this.currentCursorColumn === this.currentMaxColumn){
                this.currentCursorColumn = 0;
            }

            this.updateCursorPosition();
        }


        //update the current row and max colmun based on up/down inputs
        if (inputs.down.isJustDown){
            PIXI.sound.play('flip')

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
                newMaxColumn = (this.currentCursorRow - Math.ceil(this.letters.length / this.lineSize) === 0) ? 2 : 1;
            }

            this.currentCursorColumn = Math.floor((this.currentCursorColumn / this.currentMaxColumn) * newMaxColumn);
            this.currentMaxColumn = newMaxColumn;
            


            this.updateCursorPosition();
        }
        else if (inputs.up.isJustDown || inputs.upAlt.isJustDown){
            PIXI.sound.play('flip')

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



        //check if the user tries to input something 
        if (inputs.enter.isJustDown){

            //if it is a letter
            if (this.currentCursorRow * this.lineSize + this.currentCursorColumn < this.letters.length){
                this.currentName += this.letters[this.currentCursorRow * this.lineSize + this.currentCursorColumn];
            }
            //if it is a special key
            else{
                const id=  2 * (this.currentCursorRow - 3) + this.currentCursorColumn;

                if (id === 0){//qwerty button
                    //completely shuffle the keyboard
                    let lettersList = this.letters.split("");
                    let shuffledLettersList = lettersList
                                        .map(value => ({ value, sort: Math.random() }))
                                        .sort((a, b) => a.sort - b.sort)
                                        .map(({ value }) => value);

                    this.letters = shuffledLettersList.join("");

                    this.setupKeyboard();

                }
                else if (id === 1){ // undo button
                    this.currentName = this.currentName.slice(0, -1);
                }
                else if (id == 2){
                    //backup the player name while the website is running 
                    if (this.currentName !== ""){
                        window.localStorage.setItem("username", this.currentName);

                    }
                    else{
                        window.localStorage.setItem("username", "1AMDUM13");
                    }
                    

                    //play the start game sound effect
                    PIXI.sound.play("startGame");

                    //load the first scene of the game  
                    mainGame.loadFirstGameScene();
                }
            }
        }

        if (inputs.escape.isJustDown){
            //reload the menu scene without saving any changes
            mainGame.changeScene(new MenuScene());
        }


        //update the name text box 
        if (!this.destroying ){
            this.nameTextBox.setText(this.currentName);
            this.nameTextBox.centerHorizontallyAt(400);
        }



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
        //set a flag 
        this.destroying = true;

        //destroy every single letter in the keyboard first
        for (let i = 0; i< this.letterTextBoxes.length; i++){
            this.letterTextBoxes[i].destroy();
        }

        //destroy the player name container 
        this.nameTextBox.destroy();

        //destroy the background graphics
        this.backgroundGraphics.destroy();

        //destroy the cursor graphics
        this.cursor.destroy();

        //destroy the special keys
        this.qwertyButton.destroy();
        this.undoButton.destroy();
        this.enterButton.destroy();
    }


}