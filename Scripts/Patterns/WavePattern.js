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

    // Lists of projectiles, their respective oscillating amplitudes, and initial phases. Amplitude is determined
    // by the position of the projectile in the line joining all projectiles.
    projectileAmplitudes = [];
    projectilePhases = [];
    projectiles = [];

    // Quantities that determine the wave.
    k = null;
    n = null;
    w = null;

    // boolean to avoid updating while destroying.
    destroying = false;

    // The current phase. It takes values 1 or -1.
    phase = 1;

    constructor(drawLayer, player, duration, waveSpeed, amplitude, startPoint, endPoint, 
        fixedPts, initialPhase=1, phaseDuration=4, projectileDamage=50, projectileDimensions={x:5, y:5},
        nonFixedPts = 1){

        // initialize properties
        super(drawLayer, player);
        this.phase = initialPhase;
        this.phaseDuration = phaseDuration;
       
        this.amplitude = amplitude;
        this.n = fixedPts + 1;
        this.nonFixedPts = nonFixedPts;
       
        this.duration = duration;
        
        this.playerCoords = new Vector(this.playerReference.x, this.playerReference.y);
        this.waveSpeed = waveSpeed;
        this.projectileDamage = projectileDamage;
        this.projectileDimensions = projectileDimensions;
        

        this.mainVect = new Vector(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        this.lineLen = this.mainVect.getNorm();
        
        
        this.k = Math.PI * this.n / this.lineLen;
        this.w = this.waveSpeed * this.k;


        // shiftVect allows us the generate the next point given the current one.
        this.shiftVect = this.mainVect.rescale(1 / ((this.nonFixedPts + 1) * this.n));
        this.shiftLen = this.shiftVect.getNorm();

        // fill pointCoords list using shiftVect
        this.pointCoords.push(startPoint);
        // this.projectilePhases.push(0);
        for (let i=1; i < (this.nonFixedPts + 1) * this.n; i++){
            this.pointCoords.push(this.pointCoords[i - 1].add(this.shiftVect));
            // this.projectilePhases.push(Math.random() * Math.PI * 2);
        }
        // this.projectilePhases.push(0);
        this.pointCoords.push(endPoint);

        // A normal unit vector to mainVect
        this.generalDirection = this.mainVect.getNormalVect().normalize().rescale(this.phase);
        
    }

    load(){
        PIXI.sound.add('wave', '././Sound/wave_init.wav');
        PIXI.sound.play('wave');
        // create the projectiles 
        for (let i=0; i < this.pointCoords.length; i++){
            // calculate individual amplitudes 
            this.projectileAmplitudes.push(2 * this.amplitude * Math.sin(this.k * i * this.shiftLen));
            
            this.projectiles.push(new Projectile(this.drawLayer, this.playerReference, this.pointCoords[i]
                , 0, this.generalDirection, this.projectileDimensions, this.projectileDamage));
        }
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
            this.generalDirection = this.generalDirection.rescale(-1);
            this.phase *= -1;
            this.currentPhaseTimer = 0;
        }

        for (let i = 0; i < this.projectiles.length; i++){

            let projectile = this.projectiles[i];
            // The sign of the amplitude must not change relative to the 'sign' of the 
            // direction of movement
            let projectileAmplitude = this.phase * this.projectileAmplitudes[i];
            projectile.changeDirection(this.generalDirection);
            
            projectile.changeSpeed((projectileAmplitude * this.w * Math.cos(this.w * this.elapsedTime)) + 
            this.waveSpeed);
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