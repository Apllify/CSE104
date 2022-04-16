"use strict";
class WavePattern extends Pattern{
    // keep track of the total time elapsed and the time spent on current phase
    // A phase is simply whether we are going in the positive normal direction or the negative one.
    elapsedTime = 0;
    phaseDuration = null;
    // Time Spent on current Phase 
    currentPhaseTimer = 0;

    // List of the generated points.
    pointCoords = [];

    // Lists of projectiles and their respective oscillating amplitudes. Amplitude is determined
    // by the position of the projectile in the line joining all projectiles.
    projectileAmplitudes = [];
    projectiles = [];

    // Quantities that determine the wave.
    k = null;
    n = null;
    w = null;

    // boolean to avoid updating while destroying.
    destroying = false;

    // The current phase. It takes values 1 or -1.
    phase = 1;

    constructor(drawLayer, player, duration, waveSpeed, amplitude, startPoint, endPoint, fixedPts, initialPhase=1, phaseDuration=4, phaseOffset=0){

        // initialize properties
        super(drawLayer, player);
        this.phase = initialPhase;
        this.phaseDuration = phaseDuration;
       
        this.amplitude = amplitude;
        this.n = fixedPts + 1;
       
        this.duration = duration;
        this.currentPhaseTimer = phaseOffset;
        
        this.playerCoords = {x: this.playerReference.x, y: this.playerReference.y};
        this.waveSpeed = waveSpeed;
        

        this.mainVect = {x: endPoint.x - startPoint.x, y: endPoint.y - startPoint.y};
        this.lineLen = this.getDist(startPoint, endPoint);
        
        
        this.k = Math.PI * this.n / this.lineLen;
        this.w = this.waveSpeed * this.k;


        // shiftVect allows us the generate the next point given the current one.
        this.shiftVect = this.rescaleVect(this.mainVect, 1 / (4 * this.n));
        let v = this.shiftVect;
        this.shiftLen = Math.sqrt(v.x*v.x + v.y *v.y);

        // fill pointCoords list using shiftVect
        this.pointCoords.push(startPoint);
        for (let i=1; i < 4 * this.n; i++){
            this.pointCoords.push(this.addVects(this.pointCoords[i - 1], this.shiftVect));
        }
        this.pointCoords.push(endPoint);

        // A normal unit vector to mainVect
        this.generalDirection = this.rescaleVect(this.normalizeVector({x: -1 * this.mainVect.y, y: this.mainVect.x}), this.phase);
        
    }

    load(){

        // create the projectiles 
        for (let i=0; i < this.pointCoords.length; i++){
            // calculate individual amplitudes 
            this.projectileAmplitudes.push(2 * this.amplitude * Math.sin(this.k * i * this.shiftLen));
            
            this.projectiles.push(new Projectile(this.drawLayer, this.playerReference, this.pointCoords[i]
                , 0, this.generalDirection, {x:5, y:5}, 50));
        }
    }

    // A few methods to help handle vector algebra
    getDist(v1, v2){
        // computes the distance between two points.
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
    }

    addVects(v1, v2){
        // computes the sum of two vectors
        return {x:v1.x + v2.x, y:v1.y + v2.y}
    }   

    rescaleVect(v, s){
        // performs scalar multiplication on a vector 
        return {x: s * v.x, y: s * v.y};
    }

    normalizeVector(v){
        //reduces the vector such that the total norm is 1
        const norm = Math.sqrt(v.x*v.x + v.y *v.y);

        let newX = 0;
        let newY = 0;

        if (norm != 0){
             newX = v.x / norm;
             newY = v.y / norm;
        }



        return {x : newX, y:newY};
    }

    update(delta, inputs){
        
        if (this.destroying){
            // don't try to update if destroy has been called
            return
        }
        // increment total and phase duration
        this.elapsedTime += delta;
        this.currentPhaseTimer += delta;

        if (this.currentPhaseTimer >= this.phaseDuration){
            // flip the normal direction and the phase 
            this.generalDirection = this.rescaleVect(this.generalDirection, -1);
            this.phase *= -1;
            this.currentPhaseTimer = 0;
        }

        for (let i = 0; i < this.projectiles.length; i++){

            let projectile = this.projectiles[i];
            // The sign of the amplitude must not change relative to the 'sign' of the 
            // direction of movement
            let projectileAmplitude = this.phase * this.projectileAmplitudes[i];
            projectile.changeDirection(this.generalDirection);
            
            projectile.changeSpeed((projectileAmplitude * this.w * Math.cos(this.w * this.elapsedTime))
                                    + this.waveSpeed);
            projectile.update(delta);
        }
    }

    isDone(){
        // tells the scene when the pattern is done.
        return this.elapsedTime >= this.duration;
    }

    destroy(){
        // destroy projectiles created by the pattern
        this.destroying = true;
        for (let projectile of this.projectiles){
            projectile.destroy();
        }
        delete this;
    }












}