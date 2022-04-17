"use strict";
class SquareCirclePattern extends Pattern{
    destroying = false;

  duration = 10;
  elapsedTime = 0;

  circleCooldown = 1;
  currentCircleCooldown = 1;
  
  squarePattern = null;
  circlePattern = null;


  constructor(drawLayer, player){
      super(drawLayer, player);
  }

  load(){
      this.squarePattern = new SquarePattern(this.drawLayer, this.playerReference, 70, 0.4, 0.6);
      this.squarePattern.activate();
  }

  update(delta, inputs){
      //increment the internal timer
      this.elapsedTime += delta;

        if (this.destroying){
            return;
        }

        if (this.isDone()){
            return;
        }


      //if the circle cooldown ran out then make a circle pattern
      this.currentCircleCooldown -= delta;
      
      if (this.currentCircleCooldown <= 0){
          this.currentCircleCooldown = this.circleCooldown;

          if (this.circlePattern != null){
              this.circlePattern.destroy();
          }
          this.circlePattern = new CirclePattern(this.drawLayer, this.playerReference, 6, 100, 250, 200);
          this.circlePattern.activate();
      }


      //update both patterns
      if (this.squarePattern != null){
          this.squarePattern.update(delta, inputs);
      }
      if (this.circlePattern != null){
          this.circlePattern.update(delta, inputs);
      }




  }

    destroy(){

        this.destroying = true;

        this.squarePattern.destroy();
        if (this.circlePattern != null){
            this.circlePattern.destroy();
        }

  }

  isDone(){
      return (this.elapsedTime >= this.duration);
  }


}

class RainPattern extends Pattern{

    destroying = false;

    duration = 10;
    elapsedTime = 0;

  cooldown = 2;
  currentCooldown = 2;

  //first one is most recent one, last one is the one that's replace everytime 
  circlePatterns = [];

  constructor(drawLayer, player){
      super(drawLayer, player);
  }

  load(){
      this.circlePatterns[0] = new CirclePattern(this.drawLayer, this.playerReference, 8, 100, 400, 300, 200);
      this.circlePatterns[0].activate();
  }


  update(delta, inputs){
      this.elapsedTime += delta;

        if (this.destroying){
            return;
        }

        if (this.isDone()){
            return;
        }

      //update both patterns if possible
      for (let pattern of this.circlePatterns){
          if (pattern != null){
              pattern.update(delta);
          }
      }

      //replace the circle pattern with a fresh one once the cooldown runs out 
      this.currentCooldown -= delta;

      if (this.currentCooldown <= 0){
          this.currentCooldown = this.cooldown;

          //destroy the second pattern if needed
          if (this.circlePatterns[1] != null){
              this.circlePatterns[1].destroy();
          }

          //move the first pattern to the second spot 
          this.circlePatterns[1] = this.circlePatterns[0];

          //replace the first pattern
          this.circlePatterns[0] = new CirclePattern(this.drawLayer, this.playerReference, 8, 100, 400, 300, 200);
          this.circlePatterns[0].activate();
      }


  }

  isDone(){
      return (this.elapsedTime >= this.duration)
  }

    destroy(){
        this.destroying = true;

        this.circlePatterns[0].destroy();
        delete this.circlePatterns[0];

        if (this.circlePatterns[1] != null){
            this.circlePatterns[1].destroy();
            delete this.circlePatterns[1];
        }

    }
}

class WaveSource extends Pattern{

    destroying = false;
    // time between successive wave releases.
    cooldown = 5;
    // list of active patterns 
    patterns = [];

    wavesReleased = 0;
    constructor(drawLayer, player, startPoint, endPoint, waveSpeed, waveCount, phaseDuration = null){
        // initialize necessary variables
        super(drawLayer, player);

        this.startPoint = startPoint;
        this.endPoint = endPoint;

        this.waveCount = waveCount;
        this.waveSpeed = waveSpeed;
        this.phaseDuration = phaseDuration;
    }

    load(){
        // initialize the first wave
        this.createNewWave();
        
    }

    getWavePhaseDuration(startToPlayerVect, waveLineVect){
        // get the  wave phase duration according to the relative positions of the startPoint, endPoint
        // and the player. We try to get a phase duration so that the player's current position is the
        // center of the normal oscillation of the wave. Note that the player can nullify the wave by
        // getting close to its place of generation (the wave will not move much in the normal direction).

        // shorter names
        let v1 = startToPlayerVect;
        let v2 = waveLineVect;
        
        // get the norms
        let a = Math.sqrt(v1.x ** 2 + v1.y ** 2);
        let b = Math.sqrt(v2.x ** 2 + v2.y ** 2);
        // project the first vector onto the second one.
        let projection = (v1.x * v2.x + v1.y * v2.y) / b;
        
        // determine the normal distance between the player and the wave
        let distance = Math.sqrt(a ** 2 - projection ** 2);
        
        // set the phase duration so that the wave oscillates normally about the player's current position.

        return 2 * distance / this.waveSpeed;

    }

    createNewWave(){
        // get these vectors to calculate the initial phase and phaseDuration
        let v1 = {x: this.playerReference.x - this.startPoint.x, y: this.playerReference.y - this.startPoint.y};
        let v2 = {x: this.endPoint.x - this.startPoint.x, y: this.endPoint.y - this.startPoint.x};

        // we want the wave to start moving towards the player as soon as it is created
        let initialPhase = -1 * Math.sign(v1.x * v2.y - v1.y * v2.x); 

        // phase has to be plus or minus one.
        if (initialPhase === 0){
            initialPhase = 1;
        }

        // get the phase duration based on the provided value. If there is no provided value,
        // get it based on the player's position
        let phaseDuration = null;
        if (this.phaseDuration === null){
            phaseDuration = this.getWavePhaseDuration(v1, v2);
        }
        else{
            phaseDuration = this.phaseDuration;
        }
        

        // create the wave and activate it.
        let newWave = new WavePattern(this.drawLayer, this.playerReference, 40, this.waveSpeed, 50, this.startPoint, this.endPoint, 2, initialPhase, phaseDuration);    
        this.patterns.push(newWave);
        newWave.activate();

        this.wavesReleased += 1;
    }

    update(delta, inputs){
        if (this.destroying){
            return 
        }
        
        this.cooldown -= delta;

        if (this.cooldown <= 0 && this.waveCount > this.wavesReleased){
            this.createNewWave()
            this.cooldown = 5;
        }

        for (let i = 0; i < this.patterns.length; i++){

            // remove finished wavepatterns and upadate the ongoing ones.
            if (this.patterns[i].isDone()){
                this.patterns[i].destroy();
                this.patterns.splice(i, 1);
                i -= 1
            }

            else{
                this.patterns[i].update(delta, inputs);
            }
        }


    }


    isDone(){
        // The pattern is done when all waves are done. 
        return this.patterns.length === 0;
    }

    destroy(){
        this.destroying = true;

        // if there are active patterns (if we are destroying before the end of the pattern)
        for (let element of this.patterns){
            element.destroy();
        }

        delete this;
    }


}


class FourCornerWaves extends Pattern{
    // places WaveSources centered on each of the four corners of the screen

    destroying = false;
    // the wavesources are created 1 second after the previous one
    offset = 1;

    // List to store the active WaveSources.
    cornerWaveSources = [];

    // Start and End Points of the wavesources
    cornerPoints = [{x: -400, y: 300}, {x: 400, y: -300}, {x: 1200, y:300}, {x: 400, y:-300}];

    // encodes the corner corresponding to the next waveSource; starts at the topleft cornerand proceeds
    // counterclockwise.
    currentStartPoint = 0;


    constructor (drawLayer, player){
        super(drawLayer, player)
    }

    createNewWaveSource(){
        // create a new waveSource at the corner indicated by currentStartPoint and activate it.
        let newWaveSource = new WaveSource(this.drawLayer, this.playerReference, 
            this.cornerPoints[this.currentStartPoint], 
            this.cornerPoints[(this.currentStartPoint + 1) % 4], 
            150, 4);
        
        this.cornerWaveSources.push(newWaveSource);
        newWaveSource.activate();

        this.currentStartPoint += 1;
    }

    load(){
        // initialize the topleft WaveSource
        this.createNewWaveSource();
    }

    update(delta, inputs){

        this.offset -= delta;
        if (this.destroying){
            return
        }

        if (this.offset <= 0 && this.currentStartPoint < 4){
            this.createNewWaveSource();
            this.offset = 1;
        }

        for (let i = 0; i < this.cornerWaveSources.length; i ++ ){
            // remove the completed WaveSources and update the ongoing ones 
            if (this.cornerWaveSources[i].isDone()){
                this.cornerWaveSources[i].destroy();
                this.cornerWaveSources.splice(i, 1);
                i -= 1;
            }

            else{
                this.cornerWaveSources[i].update(delta, inputs);
            }
        }



    }

    isDone(){
        // the pattern ends when all WaveSources are finished
        return this.cornerWaveSources.length === 0;
    }
    destroy(){
        this.destroying = true;
        // make sure we don't have ongoing patterns in case destroy is called prematurely.
        for (let element of this.cornerWaveSources){
            element.destroy();
        }
        delete this;
    }

}

class SquareWithWave extends Pattern{

    destroying = false;
    // time between initializing new WaveSources
    waveCoolDown = 1;

    // The patterns that will be displayed
    square = null;
    waveSources = [];

    // Waves to be created along the lines joining midpoints of adjacent sides
    sourceCoords = [{x: 0, y: 300}, {x:400, y:0}, {x:800, y:300}, {x:400, y:600}];

    // index of the startPoint of the next WaveSource
    index = 0;

    constructor(drawLayer, player){
        super(drawLayer, player);
    }

    load(){
        // initialize the SquarePattern and a WaveSource and activeate them
        this.square = new SquarePattern(this.drawLayer, this.playerReference, 70, 0.4, 0.6);
        this.square.activate();
        this.waveSources.push(new WaveSource(this.drawLayer, this.playerReference, {x:0, y:600},
            {x:800, y:600}, 100, 2));
        this.waveSources[0].activate()
    }

    update(delta, inputs){

        if (this.destroying){
            return 
        }

        this.waveCoolDown -= delta;

        if (this.waveCoolDown <= 0 && this.index < 4){
            this.createNewWaveSource();
            this.waveCoolDown = 1;
        }

        for (let i = 0; i < this.waveSources.length; i++){
            // remove finished waveSources and update ongoing ones
            if (this.waveSources[i].isDone()){
                this.waveSources[i].destroy();
                this.waveSources.splice(i, 1);
                i -= 1;
            }

            else{
                this.waveSources[i].update(delta, inputs);
            }
        }
        this.square.update(delta, inputs);
        
    }

    createNewWaveSource(){
        // create a new WaveSource at the positions encoded by the current index
        let newWaveSource = new WaveSource(this.drawLayer, this.playerReference, this.sourceCoords[this.index],
            this.sourceCoords[(this.index + 1) % 4], 150, 2, 1);
        
        this.waveSources.push(newWaveSource);
        newWaveSource.activate();

        this.index += 1;
    }

    isDone(){
        // the pattern is done when all patterns are done 
        return this.square.isDone() || this.waveSources.length === 0;
    }

    destroy(){
        this.destroying = true;
        this.square.destroy();
        
        for (let element of this.waveSources){
            element.destroy();
        }
        delete this 
    }
}