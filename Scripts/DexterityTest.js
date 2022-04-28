'use strict';
class DexterityTest{
    
    // load these pngs 
    requiredAssets = {
        'u': 'Sprites/up.png',
        'd':'Sprites/down.png',
        'r':'Sprites/right.png',
        'l':'Sprites/left.png'
    };

    directions = ['u', 'd', 'l', 'r']
    // associate each direction with an arrow key 
    stringToKey = {
        'u': inputs.upArrow,
        'd': inputs.downArrow,
        'l': inputs.leftArrow,
        'r': inputs.rightArrow
    };
    // this shall hold the sprites associated with the directions 
    sprites = [];
    // the directions are stored in a long string this variable holds the current direction we are examining 
    index = 0;
    // self-explanatory 
    currentSprite = null;
    // the current direction 
    currentChar = null;
    // this allows us to keep track of the fade texts at the begining 
    currentFadeText = null;
    // we use this to switch between sprites 
    takeNew = true;
    
    destroying = false;

    timer = 50;
    timerText = null;
    // time penalty for wrong button click
    penalty = 2;

    fadeTexts = [];
    
    startAttack = false;
    attackWon = false;

    difficulty = {
        'easy': [(length) => length, 2],
        'medium': [(length) => length / 2, 4],
        'hard': [(length) => length/ 3, 6],
        'ultraHard': [(length) => length / 4, 8]
    }
    
    constructor(length, difficulty='easy'){
        // set up the length and difficulty 
        this.length = length;
        this.chosenDifficulty = difficulty;
        // we give a duration based on the difficulty and length
        this.penalty = this.difficulty[this.chosenDifficulty][1];
        this.timer = Math.floor(this.difficulty[this.chosenDifficulty][0](length));
        

        this.fadeTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 120,
            fontWeight : "bold",
            fill : "#ff0000",
            stroke : "#ff0000",
        });

        this.timerTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 36,
            fontWeight : "bold",
            fill : "#000000",
        });

        this.penaltyTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 36,
            fontWeight : "bold",
            fill : "#ff0000",
        })

    
        
    }

    load(){
        // this encodes the entire sequence
        this.string = '';

        for(let i = 0; i <this.length; i++){
            // randomly select a sequence and place sprites on the screen
            let x = Math.floor(Math.random() * 4);
            let direction = this.directions[x];
            
            this.string += direction;
            let sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[direction].texture);
            
            drawLayers.activeLayer.addChild(sprite);
            sprite.x = i * 33;
            
            sprite.y = 384;
            this.sprites.push(sprite);
        }
        
        // we want to pop from the list throughout so we reverse it 
        this.sprites.reverse();
        // this TextDisplay displays the time left
        this.timerText = new TextDisplay(drawLayers.foregroundLayer, `${this.timer}`, {x:400, y:10}, this.timerTextStyle);
        const position = {x: 440 + this.timerText.getDimensions().width, y: 10}
        this.penaltyText = new FadeText(drawLayers.foregroundLayer, `${-1 * this.penalty}`, position, this.penaltyTextStyle, 1);
    
        
        for(let x of ['3', 'ON 3']){
            
            let fadeText = new FadeText(drawLayers.foregroundLayer, x, {x:200, y:150}, this.fadeTextStyle, 2);
            
            fadeText.centerHorizontallyAt(400);
            fadeText.centerVerticallyAt(200);
            
            this.fadeTexts.push(fadeText);
        }
        
        this.currentFadeText = this.fadeTexts.pop();

        this.currentFadeText.initiate();

        PIXI.sound.add('hit', './Sound/dexterity_hit.wav');
        PIXI.sound.add('miss', './Sound/dexterity_miss.wav')
    }

    update(delta, inputs){
        if (this.destroying || this.isDone()){
            this.penaltyText.textEntity.alpha = 0;
            return;
        }


        // we start attack as soon as the fade texts are finished 
        if (!this.startAttack){
            this.currentFadeText.update(delta, inputs);
            this.startAttackCheck();
            return;
        }
        
        this.penaltyText.update(delta, inputs);

        if (this.takeNew && this.sprites.length > 0){
            // take a new direction and a new sprite (the leftmost on the screen)
            this.currentChar = this.string[this.index];
            this.currentSprite = this.sprites.pop();
            
            this.index += 1;
            this.takeNew = false;
        }

        if (this.stringToKey[this.currentChar].isJustDown){
            // the key associated to this sprite is pressed so we destroy the sprite and shift all sprites
            // to the left 
            this.currentSprite.destroy();
            PIXI.sound.play('hit');
            this.shiftSprites(-33);
            
            this.takeNew = true;
            
            if (this.sprites.length === 0){
                // all sprites are destroyed 
                this.attackWon = true;
            }
        }

        for (let direction of this.directions){
            
            if (direction !== this.currentChar && this.stringToKey[direction].isJustDown){
                this.timer -= this.penalty;
                PIXI.sound.play('miss');
                this.penaltyText.initiate();
            } 
        }

        // update the timer
        this.timer = Math.max(this.timer - delta, 0);
        this.timerText.setText(`${Math.round(this.timer * 10) / 10}`);


    }

    startAttackCheck(){
        // Start attack or update fadetext object  (or do nothing)
        if (this.currentFadeText.isDone()){
            
            this.currentFadeText.destroy();
            
            if (this.fadeTexts.length > 0){
               
                this.currentFadeText = this.fadeTexts.pop();
                this.currentFadeText.initiate();
            }

            else{
                
                this.startAttack = true;
            }
        }
    }

    isDone(){
        // ends when the attack is won or the timer runs out 
        return this.attackWon || this.timer <= 0;
    }

    destroy(){
        this.destroying = true;
        // destroy the timer
        this.timerText.destroy();
        // destroy the current sprite and fadetext (if they are still undestroyed)
        if (this.currentSprite.destroy != undefined){
            this.currentSprite.destroy();
        }

        if (this.currentFadeText.destroy != undefined){
            this.currentFadeText.destroy();
        }
        // destroy the rest of fadeTexts and sprites 
        for (let fadeText of this.fadeTexts){
            fadeText.destroy();
        }
        for (let sprite of this.sprites){
            
            sprite.destroy();
        }
    }

    shiftSprites(shift){
        
        for(let sprite of this.sprites){
           
            sprite.x += shift
        }
    }

    
}