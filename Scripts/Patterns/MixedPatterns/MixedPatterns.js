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
    cooldown = 5;
    patterns = [];
    wavesReleased = 0;
    constructor(drawLayer, player, startPoint, endPoint, waveSpeed, waveCount){
        super(drawLayer, player);
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.waveCount = waveCount;
        this.waveSpeed = waveSpeed;
    }

    load(){
        this.createNewWave();
        
    }

    getWavePhaseDuration(startToPlayerVect, waveLineVect){
        let v1 = startToPlayerVect;
        let v2 = waveLineVect;
        console.log(v1, v2)
        let a = Math.sqrt(v1.x ** 2 + v1.y ** 2);
        let b = Math.sqrt(v2.x ** 2 + v2.y ** 2);
        let projection = (v1.x * v2.x + v1.y * v2.y) / b;
        console.log(projection);
        console.log(a);
        let distance = Math.sqrt(a ** 2 - projection ** 2);
        console.log(2 * distance / this.waveSpeed)
        return 2 * distance / this.waveSpeed;

    }

    createNewWave(){
        let v1 = {x: this.playerReference.x - this.startPoint.x, y: this.playerReference.y - this.startPoint.y};
        let v2 = {x: this.endPoint.x - this.startPoint.x, y: this.endPoint.y - this.startPoint.x};
        let initialPhase = -1 * Math.sign(v1.x * v2.y - v1.y * v2.x); 
        if (initialPhase === 0){
            initialPhase = 1;
        }
        let phaseDuration = this.getWavePhaseDuration(v1, v2);
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
        return this.patterns.length === 0;
    }

    destroy(){
        this.destroying = true;
        for (let element of this.patterns){
            element.destroy();
        }
        delete this;
    }


}