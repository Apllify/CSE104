"use strict";

//super important helper function for detecting keyboard inputs
function keyboard(value) {

    const key = {};
    key.value = value;


    key.isDown = false;
    key.isUp = true;


    key.wasDownLastFrame = false;
    key.wasUpLastFrame = true;

    key.isJustDown = false;
    key.isJustUp = false;



    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = (event) => {
      if (event.key === key.value) {

        key.isUp = false;
        key.isDown = true;
        key.isJustDown = false;

        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = (event) => {
      if (event.key === key.value) {

        key.isUp = true;
        key.isDown = false;

        event.preventDefault();
      }
    };


    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener("keydown", downListener, false);
    window.addEventListener("keyup", upListener, false);
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);

    };
    
    return key;
  }



//instantiating the game window
const app = new PIXI.Application({
    width : 800, height : 600, backgroundColor: 0x8b8c8b
});

document.body.appendChild(app.view);

app.view.style.position = "absolute";
app.view.style.display = "inline-block";
positionGame();


//allow the window to reposition itself whenever the tab is resized
window.addEventListener("resize", positionGame);

function positionGame(){
  app.view.style.left =  ((window.innerWidth - 800)*0.5)  + "px";
  app.view.style.top =  ((window.innerHeight - 600)*0.5) + "px";
}



//setting the scale mode to accomodate for pixel art
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RENDER_OPTIONS.antialias = false;

//no fucking clue what this does
// but it is 100000% essential to the project
//edit : i think it has something to do with converting the aseprite json export format to a usable format by pixi.js

//edit edit : i tweaked a lot of the code to make it work still 
PIXI.Loader.shared
.use((resource, next) => {
if (resource.extension === 'json' && resource.data.meta.app === 'http://www.aseprite.org/') {

    for (const tag of resource.data.meta.frameTags) {

        const frames = [];

        for (let i = tag.from; i < tag.to; i++) {
          let framesKey = Object.keys(resource.data.frames)[i];
          let textureKey = Object.keys(resource.textures)[i];


          frames.push({ texture: resource.textures[textureKey], time: resource.data.frames[framesKey].duration });
        }

        if (tag.direction === 'pingpong') {
            for (let i = tag.to; i >= tag.from; i--) {

              let framesKey = Object.keys(resource.data.frames)[i];
              let textureKey = Object.keys(resource.textures)[i];

              frames.push({ texture: resource.textures[textureKey], time: resource.data.frames[framesKey].duration });
            }
        }

        resource.spritesheet.animations[tag.name] = frames;
    }
}

next();
})



//creating the different layers
const backgroundLayer = new PIXI.Container();
const activeLayer = new PIXI.Container();
const foregroundLayer = new PIXI.Container();
const transitionForegroundLayer = new PIXI.Container();

app.stage.addChild(backgroundLayer);
app.stage.addChild(activeLayer);
app.stage.addChild(foregroundLayer);
app.stage.addChild(transitionForegroundLayer);

const drawLayers = {
  backgroundLayer : backgroundLayer,
  activeLayer : activeLayer,
  foregroundLayer : foregroundLayer,
  transitionForegroundLayer: transitionForegroundLayer
}







//saving all of the important inputs
const inputs = {
  left : keyboard("q"),
  leftAlt : keyboard("a"),

  up : keyboard("z"),
  upAlt : keyboard("w"),

  right : keyboard("d"),

  down : keyboard("s"),

  space : keyboard(" "),
  enter : keyboard("Enter"),
  escape : keyboard("Escape"),
  upArrow: keyboard('ArrowUp'),
  downArrow: keyboard('ArrowDown'),
  leftArrow: keyboard('ArrowLeft'),
  rightArrow: keyboard('ArrowRight'),

  toggleGrader: keyboard('g')
}




const mainGame = new Game(drawLayers)   // instantiate a game. 

app.ticker.add((delta) => {   // update the game continuously. 
    let deltaTime = app.ticker.elapsedMS / 1000;  // this is the number of seconds since the last frame.

    for(let inputKey of Object.keys(inputs) ){

      let input = inputs[inputKey];

      //manually check whether the input was just toggled
      if(input.isDown && !input.wasDownLastFrame){
        input.isJustDown = true;
      }
      else{
        input.isJustDown = false;
      }

      if (input.isUp && !input.wasUpLastFrame){
        input.isJustUp = true;
      }
      else{
        input.isJustUp = false;
      }


      //update the last frame's inputs at the end
      input.wasDownLastFrame = input.isDown;
      input.wasUpLastFrame = input.isUp;
    }

    mainGame.update(deltaTime, inputs);
});

