'use strict';
class WaveSource extends Pattern{

    destroying = false;
    // time between successive wave releases.
    cooldown = 5;
    // list of active patterns 
    patterns = [];

    // We don't generate all waves at the same place; we also shift a bit to either direction
    shiftRescale = [0, 0.5, -0.5];
    currentShiftRescaleIndex = 0;

    wavesReleased = 0;
    constructor(drawLayer, player, startPoint, endPoint, waveAmplitude, waveSpeed, waveCount, 
        waveDuration, fixedPts, nonFixedPts, projectileDimensions, projectileDamage, phaseDuration = null){
       
        // initialize necessary variables
        super(drawLayer, player);

        this.startPoint = startPoint;
        this.endPoint = endPoint;

        this.waveCount = waveCount;
        this.waveSpeed = waveSpeed;
        
        this.phaseDuration = phaseDuration;
        this.waveDuration = waveDuration;
        
        this.nonFixedPts = nonFixedPts;
        this.fixedPts = fixedPts;
        this.waveAmplitude = waveAmplitude;

        this.projectileDamage = projectileDamage;
        this.projectileDimensions = projectileDimensions;

        this.shiftVect = this.determineShiftVect();
    }

    load(){
        // initialize the first wave
        if (this.waveCount > 0){
            this.createNewWave();
        }  
        
        
    }

    determineShiftVect(){
        let mainVect = new Vector(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y);
        let norm = mainVect.getNorm();
        let rescaleFactor = 1 / ((this.nonFixedPts + 1) * (this.fixedPts + 1));
        return mainVect.rescale(rescaleFactor);
    }

    getWavePhaseDuration(startToPlayerVect, waveLineVect){
        // get the  wave phase duration according to the relative positions of the startPoint, endPoint
        // and the player. We try to get a phase duration so that the player's current position is the
        // center of the normal oscillation of the wave. Note that the player can nullify the wave by
        // getting close to its place of generation (the wave will not move much in the normal direction).


        // get the norms
        let a = startToPlayerVect.getNorm();
        let b = waveLineVect.getNorm();
        // project the first vector onto the second one.
        let projection = startToPlayerVect.dotProduct(waveLineVect) / b;
        
        // determine the normal distance between the player and the wave
        let distance = Math.sqrt(a ** 2 - projection ** 2);
        
        // set the phase duration so that the wave oscillates normally about the player's current position.
        return 2 * distance / this.waveSpeed;

    }

    createNewWave(){
        // get these vectors to calculate the initial phase and phaseDuration
        let v1 = new Vector(this.playerReference.x - this.startPoint.x, this.playerReference.y - this.startPoint.y);
        let v2 = new Vector(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y);

        // we want the wave to start moving towards the player as soon as it is created
        let initialPhase = -1 * Math.sign(v1.crossProdScalar(v2)); 

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
        let newWave = new WavePattern(this.drawLayer, this.playerReference, 
            this.waveDuration, this.waveSpeed, this.waveAmplitude, 
            this.startPoint.add(this.shiftVect.rescale(this.shiftRescale[this.currentShiftRescaleIndex])), 
            this.endPoint.add(this.shiftVect.rescale(this.shiftRescale[this.currentShiftRescaleIndex])), 
            this.fixedPts, initialPhase, phaseDuration,
            this.projectileDamage, this.projectileDimensions,
            this.nonFixedPts);    
        this.currentShiftRescaleIndex = (this.currentShiftRescaleIndex + 1) % 3;

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
            this.createNewWave();

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