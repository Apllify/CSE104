'use strict';

class RollCreditsScene{
    // Keeps Track of the current credits position
    currentIndex = 0;
    // Stores the generated fade Texts
    fadeTexts = [];
    // Distance between Lines 
    lineHeight = 50;
    // Duration of each fade 
    fadeDuration = 5;
    

    constructor(){
        // Different Text Styles for Credit Title and Names
        this.titleTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#0000ff",
            stroke : "#0000ff",
        });
    
        this.nameTextStyle = new PIXI.TextStyle({
            fontFamily : "BrokenConsole",
            fontSize : 24,
            fontWeight : "bold",
            fill : "#ffffff",
            stroke : "#ffffff",
        });

        
    }

    load(){
        // The first element in each credit is considered the title
        this.credits = [
            ['To Be Continued...'],
            ['Powered By: ', 'PIXI JS'],
            ['Story By: ', 'Rali Lahlou'],
            ['Thank you for playing!']
        ]
        // Black background
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000);
        this.background.drawRect(0, 0, 800, 600);
        drawLayers.backgroundLayer.addChild(this.background);
        // Start the first credit
        this.initiateNext();

    }

    update(delta, inputs){
        // Update the fade texts or generate new ones if the scene is not over. Otherwise, change the scene
        if (this.fadeTexts[this.fadeTexts.length - 1].isDone()){
            if (!this.isDone()){
                this.initiateNext();
            }

            else{
                mainGame.changeScene(new MenuScene());
            }
            
        }

        else{
            for (let element of this.fadeTexts){
                element.update(delta, inputs);
            }
        }
    }

    initiateNext(){

        // The number of lines in the current credit 
        let n = this.credits[this.currentIndex].length;
        // Destroy the previous fadeTexts
        for (let element of this.fadeTexts){
            element.destroy();
        }
        // Reset the list to the empty list 
        this.fadeTexts = [];
        // get the central vertical position for the first title based on the length of the current credit
        let currentYCenter = this.getStartYpos(n);

        for (let i = 0; i < n; i++){
            // Choose textStyle depending on whether the text is a title or a name
            let textStyle = null;
            if (i == 0){
                textStyle = this.titleTextStyle;
            }

            else{
                textStyle = this.nameTextStyle;
            }
            // Create the FadeText entity and center it at the appropriate position
            let newFadeText = new FadeText(drawLayers.foregroundLayer, this.credits[this.currentIndex][i], {x:0, y:0}, textStyle, this.fadeDuration);
            newFadeText.centerHorizontallyAt(400);
            newFadeText.centerVerticallyAt(currentYCenter);
            // increment the centeral vertical position for the next one
            currentYCenter += this.lineHeight;
            // initiate and push the new fade text to the list
            newFadeText.initiate();
            this.fadeTexts.push(newFadeText);
            
        
        
        }

        // increment the index for the next credit 
        this.currentIndex += 1;


        

    }

    isDone(){
        // returns true if we have displayed all credits 
        return this.currentIndex === this.credits.length;
    }

    getStartYpos(length){
        // Returns the Y position of the title text depending on the length of the credit and the line height
        if (length % 2 === 1){
            return 300 - this.lineHeight * (Math.floor(length / 2))
        }

        else{
            return 300 - this.lineHeight * (1/2 + (length / 2 - 1));
            
        }
    }

    destroy(){
        // Remove the black background and destroy the fade texts 
        drawLayers.backgroundLayer.removeChild(this.background);
        for(let element of this.fadeTexts){
            element.destroy();
        }

        delete this;
    }
}