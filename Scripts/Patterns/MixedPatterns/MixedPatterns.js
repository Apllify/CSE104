"use strict";
class SquareCirclePattern extends Pattern{

  // parameters based on difficulty chosen  
  difficulty = {
      'easy': {
          projectileSpeed: {min:70, max:100},
          minScale: 0.5,
          maxScale: 0.8,
          projectileCount: 4,
          projectileDamage: 20,
          targetPoints:8,
          projectileDimensions: {x:10, y:10},
          borderDamage: 50
      },

      'medium':{
          projectileSpeed: {min:100, max:250},
          minScale: 0.4,
          maxScale: 0.6,
          projectileCount: 5,
          projectileDamage: 30,
          targetPoints:10,
          projectileDimensions: {x:13, y:13},
          borderDamage: 70
      },

      'hard':{
          projectileSpeed: {min:200, max:300},
          minScale: 0.3,
          maxScale: 0.5,
          projectileCount: 5,
          projectileDamage: 40,
          targetPoints:12,
          projectileDimensions: {x:16, y:16},
          borderDamage: 80  
      },

      'ultraHard':{
          projectileSpeed: {min:300, max: 450},
          minScale: 0.4,
          maxScale: 0.45,
          projectileCount: 5,
          projectileDamage: 55,
          targetPoints: 12,
          projectileDimensions: {x: 12, y: 12},
          borderDamage: 85
      }
  }
  destroying = false;

  circleCooldown = 1;
  currentCircleCooldown = 1;
  
  squarePattern = null;
  circlePattern = null;


  constructor(drawLayer, player, difficulty='medium'){
      super(drawLayer, player);
      this.chosenDifficulty = difficulty;
  }

  load(){
      this.squarePattern = new SquarePattern(this.drawLayer, this.playerReference, 70, 
        this.difficulty[this.chosenDifficulty].minScale, 
        this.difficulty[this.chosenDifficulty].maxScale,
        this.difficulty[this.chosenDifficulty].targetPoints,
        this.difficulty[this.chosenDifficulty].borderDamage);
      this.squarePattern.activate();
  }

  update(delta, inputs){
      //increment the internal timer

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
          this.circlePattern = new CirclePattern(this.drawLayer, this.playerReference, 
            this.difficulty[this.chosenDifficulty].projectileCount, 
            this.difficulty[this.chosenDifficulty].projectileSpeed.min, 
            this.difficulty[this.chosenDifficulty].projectileSpeed.max, 200,
            this.difficulty[this.chosenDifficulty].projectileDamage,
            this.difficulty[this.chosenDifficulty].projectileDimensions);
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
      return this.squarePattern.isDone();
  }


}

class RainPattern extends Pattern{

    // parameters based on difficulty chosen
    difficulty = {
        'easy':{
            projectileCount: 5,
            projectileSpeed: {min:70, max:200},
            coolDown: 4,    
            duration: 10,
            damage: 70,
            projectileDimensions: {x:10, y:10}
        },
        'medium':{
            projectileCount: 6,
            projectileSpeed: {min:100, max:400},
            coolDown: 2.5,
            duration: 15,
            damage: 150,
            projectileDimensions: {x:12, y:12}
        },
        'hard':{
            projectileCount: 7,
            projectileSpeed: {min:200, max:500},
            coolDown:1.5,
            duration: 20,
            damage: 250,
            projectileDimensions: {x:14, y:14}
        },

        'ultraHard':{
            projectileCount:7,
            projectileSpeed: {min:250, max:550},
            coolDown: 1.2,
            duration: 30,
            damage: 250,
            projectileDimensions: {x:15, y:15}
        }

    }

    destroying = false;
    elapsedTime = 0;

  //first one is most recent one, last one is the one that's replace everytime 
  circlePatterns = [];

  constructor(drawLayer, player, difficulty='medium'){
      super(drawLayer, player);
      this.chosenDifficulty = difficulty;
      
      this.coolDown = this.difficulty[difficulty].coolDown;
      
      this.currentCoolDown = this.coolDown;
      
      this.duration = this.difficulty[difficulty].duration;
      console.log(this.coolDown, this.currentCoolDown)
  }

  load(){
      this.circlePatterns[0] = new CirclePattern(this.drawLayer, this.playerReference, 
        this.difficulty[this.chosenDifficulty].projectileCount, 
        this.difficulty[this.chosenDifficulty].projectileSpeed.min, 
        this.difficulty[this.chosenDifficulty].projectileSpeed.max, 
        300, 
        this.difficulty[this.chosenDifficulty].damage,
        this.difficulty[this.chosenDifficulty].projectileDimensions);
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
      this.currentCoolDown -= delta;

      if (this.currentCoolDown <= 0){
          console.log('here')
          this.currentCoolDown = this.coolDown;

          //destroy the second pattern if needed
          if (this.circlePatterns[1] != null){
              this.circlePatterns[1].destroy();
          }

          //move the first pattern to the second spot 
          this.circlePatterns[1] = this.circlePatterns[0];

          //replace the first pattern
          this.circlePatterns[0] = new CirclePattern(this.drawLayer, this.playerReference, 
            this.difficulty[this.chosenDifficulty].projectileCount, 
            this.difficulty[this.chosenDifficulty].projectileSpeed.min, 
            this.difficulty[this.chosenDifficulty].projectileSpeed.max, 
            300, 
            this.difficulty[this.chosenDifficulty].damage,
            this.difficulty[this.chosenDifficulty].projectileDimensions);
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



class FourCornerWaves extends Pattern{

    // parameters based on difficulty chosen
    difficulty = {
        'easy':{
            waveSpeed: 200, 
            waveDuration: 30,
            projectileDamage: 60, 
            waveCount:[2, 2, 2, 2],
            fixedPts:1,
            nonFixedPts:1,
            projectileDimensions:{x:10, y:10},
        },

        'medium':{
            waveSpeed: 250,
            waveDuration: 30,
            projectileDamage: 70,
            waveCount: [1, 2, 1, 2],
            fixedPts: 1,
            nonFixedPts: 2,
            projectileDimensions: {x:7, y:7}
        },

        'hard':{
            waveSpeed:310,
            waveDuration:35,
            projectileDamage:80,
            waveCount:[1, 2, 1, 2],
            fixedPts:1,
            nonFixedPts:2,
            projectileDimensions: {x:8, y:8}
        },

        'ultraHard':{
            waveSpeed: 325,
            waveDuration: 40,
            projectileDamage: 85,
            waveCount:[2,1,2,1],
            fixedPts: 2,
            nonFixedPts: 2,
            projectileDimensions: {x:4.5, y:4.5}
        }
    }
    // places WaveSources centered on each of the four corners of the screen
    destroying = false;
    // the wavesources are created 1 second after the previous one
    offset = 1;


    // List to store the active WaveSources.
    cornerWaveSources = [];

    // Start and End Points of the wavesources
    cornerPoints = [new Vector(-400, 300), new Vector(400, -300), new Vector(1200, 300), new Vector(400, -300)];

    // encodes the corner corresponding to the next waveSource; starts at the topleft cornerand proceeds
    // counterclockwise.
    currentStartPoint = 0;


    constructor (drawLayer, player, difficulty){
        super(drawLayer, player);
        this.chosenDifficulty = difficulty;
    }

    createNewWaveSource(){
        // create a new waveSource at the corner indicated by currentStartPoint and activate it.
        let newWaveSource = new WaveSource(this.drawLayer, this.playerReference, 
            this.cornerPoints[this.currentStartPoint], 
            this.cornerPoints[(this.currentStartPoint + 1) % 4], 
            50, this.difficulty[this.chosenDifficulty].waveSpeed, 
            this.difficulty[this.chosenDifficulty].waveCount[(this.currentStartPoint + 1) % 4], 
            this.difficulty[this.chosenDifficulty].waveDuration, 
            this.difficulty[this.chosenDifficulty].fixedPts, 
            this.difficulty[this.chosenDifficulty].nonFixedPts, 
            this.difficulty[this.chosenDifficulty].projectileDimensions, 
            this.difficulty[this.chosenDifficulty].projectileDamage);
        
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

    // parameters based on difficulty chosen
    difficulty = {
        'easy':{
            waveSpeed: 150,
            minScale: 0.5,
            maxScale: 0.8,
            waveDuration: 30,
            targetPoints: 8,
            projectileDamage: 50,
            projectileDimensions: {x: 10, y:10},
            fixedPts: 1,
            nonFixedPts: 1,
            waveCount: [2, 1, 1, 2],
            bottomWave: false,
            borderDamage: 70
        },

        'medium':{
            waveSpeed: 190, 
            minScale: 0.6,
            maxScale: 0.7,
            waveDuration: 35,
            targetPoints: 8,
            projectileDamage: 70,
            projectileDimensions: {x:6, y:6},
            fixedPts: 1,
            nonFixedPts: 1,
            waveCount: [1, 1, 0, 1],
            bottomWave: false,
            borderDamage: 85
        },

        'hard':{
            waveSpeed: 210,
            minScale: 0.4,
            maxScale: 0.5,
            waveDuration: 40,
            targetPoints: 10,
            projectileDamage: 80,
            projectileDimensions: {x:8, y:8},
            fixedPts: 1,
            nonFixedPts: 1,
            waveCount: [0, 1, 1, 0],
            bottomWave: true,
            borderDamage: 100
        },
        
        'ultraHard':{
            waveSpeed: 250,
            minScale: 0.3,
            maxScale: 0.4,
            waveDuration: 40,
            targetPoints: 11,
            projectileDamage: 80,
            projectilDimensions: {x:8, y:8},
            fixedPts: 1,
            nonFixedPts: 1,
            waveCount: [1,1,1,1],
            bottomWave:true,
            borderDamage: 100
        }
    }

    destroying = false;
    // time between initializing new WaveSources
    waveCoolDown = 1;

    // The patterns that will be displayed
    square = null;
    waveSources = [];

    // Waves to be created along the lines joining midpoints of adjacent sides
    sourceCoords = [new Vector(0, 300), new Vector(400, 0), new Vector(800, 300), new Vector(400, 600)];

    // index of the startPoint of the next WaveSource
    index = 0;

    constructor(drawLayer, player, difficulty='medium'){

        super(drawLayer, player);
        this.chosenDifficulty = difficulty;
    }

    load(){
        // initialize the SquarePattern and a WaveSource and activeate them
        this.square = new SquarePattern(this.drawLayer, this.playerReference,
            70, this.difficulty[this.chosenDifficulty].minScale,
            this.difficulty[this.chosenDifficulty].maxScale, 
            this.difficulty[this.chosenDifficulty].targetPoints,
            this.difficulty[this.chosenDifficulty].borderDamage);
        this.square.activate();
        
        if (this.difficulty[this.chosenDifficulty].bottomWave){
            console.log('here', this.chosenDifficulty)
            this.waveSources.push(new WaveSource(this.drawLayer, this.playerReference, new Vector(0, 600),
            new Vector(800, 600), 50, 
            this.difficulty[this.chosenDifficulty].waveSpeed, 2,
            30, 1, 1, {x: 8, y: 8}, 
            this.difficulty[this.chosenDifficulty].projectileDamage
            ));

            this.waveSources[0].activate();
        }
        
        
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
            this.sourceCoords[(this.index + 1) % 4], 50, 
            this.difficulty[this.chosenDifficulty].waveSpeed,
            this.difficulty[this.chosenDifficulty].waveCount[(this.index + 1) % 4],
            this.difficulty[this.chosenDifficulty].waveDuration,
            this.difficulty[this.chosenDifficulty].fixedPts,
            this.difficulty[this.chosenDifficulty].nonFixedPts,
            this.difficulty[this.chosenDifficulty].projectileDimensions,
            this.difficulty[this.chosenDifficulty].projectileDamage,
            );
        
        this.waveSources.push(newWaveSource);
        newWaveSource.activate();

        this.index += 1;
    }

    isDone(){
        // the pattern is done when all patterns are done 
        return this.square.isDone();
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


class PacmanWithWave extends Pattern{

     // parameters based on difficulty chosen
    difficulty = {
        'easy':{
            duration: 40,
            pacmanCooldown: 2,
            shotSpeed: 100,
            waveSpeed: 150,
            fixedPts: 1,
            nonFixedPts: 1,
            projectileDimensions: {x: 12, y: 12},
            projectileDamage: 50,
            waveCoolDown: 5

        },

        'medium':{
            duration: 40,
            pacmanCooldown: 2,
            shotSpeed: 150,
            waveSpeed: 200,
            fixedPts: 1,
            nonFixedPts: 1,
            projectileDimensions: {x: 14, y: 14},
            projectileDamage: 50,
            waveCoolDown: 5
        },

        'hard':{
            duration: 50,
            pacmanCooldown: 1.5,
            shotSpeed: 250,
            waveSpeed: 290,
            fixedPts: 1,
            nonFixedPts: 1,
            projectileDimensions: {x: 8, y: 8},
            projectileDamage: 80,
            waveCoolDown: 3
        },

        'ultraHard':{
            duration: 50,
            pacmanCooldown: 1,
            shotSpeed: 250,
            waveSpeed: 300,
            fixedPts: 1,
            nonFixedPts: 1,
            projectileDimensions: {x: 10, y: 10},
            projectileDamage: 80,
            waveCoolDown: 3
        }
    }

    // time between wavesource creation
    cooldown = 2;

    destroying = false;

    pacmanPattern = null;

    waveSources = [];
    // sources placed at the bottom 
    sourceCoords = [new Vector(0, 600), new Vector(400, 600), new Vector(800, 600)];
    currentStartIndex = 0;

    constructor(drawLayer, player, difficulty){
        super(drawLayer, player);
        this.chosenDifficulty = difficulty;
    }

    load(){
        this.pacmanPattern = new PacmanPattern(this.drawLayer, this.playerReference, 
            this.difficulty[this.chosenDifficulty].duration,
            this.difficulty[this.chosenDifficulty].pacmanCooldown,
            this.difficulty[this.chosenDifficulty].shotSpeed, {x: 16, y:16}, 
            this.difficulty[this.chosenDifficulty].projectileDamage * 2);
    }

    createNewWaveSource(){
        let newWaveSource = new WaveSource(this.drawLayer, this.playerReference,
            this.sourceCoords[this.currentStartIndex], this.sourceCoords[this.currentStartIndex + 1], 50,
            this.difficulty[this.chosenDifficulty].waveSpeed, 
            1, 5, 
            this.difficulty[this.chosenDifficulty].fixedPts, 
            this.difficulty[this.chosenDifficulty].nonFixedPts, 
            this.difficulty[this.chosenDifficulty].projectileDimensions,
            this.difficulty[this.chosenDifficulty].projectileDamage,
            this.difficulty[this.chosenDifficulty].waveCoolDown);
        
        this.waveSources.push(newWaveSource);
        newWaveSource.activate();
        
        this.currentStartIndex = 1 - this.currentStartIndex;
        
    }

    update(delta, inputs){
        this.cooldown -= delta;
        if (this.destroying){
            return;
        }

        if (this.cooldown <= 0){
            this.createNewWaveSource();
            this.cooldown = 2;
        }
        
        this.pacmanPattern.update(delta, inputs);

        for (let i = 0; i < this.waveSources.length; i++){
            if (this.waveSources[i].isDone()){
                
                this.waveSources[i].destroy();
                this.waveSources.splice(i, 1);
            }

            else{
                this.waveSources[i].update(delta, inputs);
            }
        }
    }

    isDone(){
        return this.pacmanPattern.isDone();
    }

    destroy(){
        this.destroying = true;
        this.pacmanPattern.destroy();
        
        for (let element of this.waveSources){
            element.destroy();
        }
        delete this;
    }
}