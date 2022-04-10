//super important helper function for detecting keyboard inputs
function keyboard(value) {
    const key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = (event) => {
      if (event.key === key.value) {
        if (key.isUp && key.press) {
          key.press();
        }
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = (event) => {
      if (event.key === key.value) {
        if (key.isDown && key.release) {
          key.release();
        }
        key.isDown = false;
        key.isUp = true;
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

//getting the window size
const screen_width = window.screen.width;
const screen_height = window.screen.height;


//instantiating the game window
const app = new PIXI.Application({
    width : 800, height : 600, backgroundColor: 0x1099bb
});

document.body.appendChild(app.view);

app.view.style.position = "absolute";
app.view.style.display = "inline-block";
app.view.style.left =  ((window.innerWidth - 800)*0.5)  + "px";
app.view.style.top =  ((window.innerHeight - 600)*0.5) + "px";



//setting the scale mode to accomodate for pixel art
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;




//creating the different layers
const backgroundLayer = new PIXI.Container();
const activeLayer = new PIXI.Container();
const foregroundLayer = new PIXI.Container();

app.stage.addChild(backgroundLayer);
app.stage.addChild(activeLayer);
app.stage.addChild(foregroundLayer);

const drawLayers = {
  backgroundLayer : backgroundLayer,
  activeLayer : activeLayer,
  foregroundLayer : foregroundLayer
}







//saving all of the important inputs
const inputs = {
  left : keyboard("q"),
  up : keyboard("z"),
  right : keyboard("d"),
  down : keyboard("s"),
  space : keyboard(" "),
  enter : keyboard("Enter")
}




const mainGame = new Game(drawLayers)   // instantiate a game. 

app.ticker.add((delta) => {   // update the game continuously. 
    mainGame.update(delta, inputs)
});

