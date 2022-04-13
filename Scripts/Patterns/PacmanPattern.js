class PacmanPattern extends Pattern{

    elapsedTime = 0;

    duration = 10;

    attackCooldown = 5;
    currentAttackCooldown = 5;


    //the attack telegraphs that happen before the attacks
    telegraphs = [];
    //the projectiles that are spawned after the telegraphs
    projectiles = [];


    constructor(patternDrawLayer, player, patternDuration, attackCooldown){
        //calling superclass constructor
        super(patternDrawLayer, player);

        //assing the constructor parameters
        this.duration = patternDuration;
        this.attackCooldown = attackCooldown;
        this.currentAttackCooldown = attackCooldown;
    }

    load(){

    }

    update(delta, inputs){
        this.elapsedTime += delta;

        this.currentAttackCooldown -= delta;

        //spawn a telegraph every now and then
        if (this.currentAttackCooldown <= 0){
            this.currentAttackCooldown = this.attackCooldown;

            //create a telegraph next to the player 
            const xOffset = Math.random() * 200 - 100;
            const yOffset = Math.random() * 200 - 100;

            this.telegraphs.push(new Telegraph(this.drawLayer, {x : this.playerReference.x + xOffset, y : this.playerReference.y + yOffset}, 2))
            ;


        }

        //update the telegraphs and projectiles
        for(let telegraph of this.telegraphs){
            if (telegraph != null){
                telegraph.update(delta);
            }
        }

        for(let projectile of this.projectiles){
            projectile.update(delta);
        }


        //check for telegraphs that are done and replace them with projectiles
        for(let i = 0; i < this.telegraphs.length; i++){

            let telegraph = this.telegraphs[i]

            if (telegraph != null){
                if (telegraph.isDone()){
                    //get direction vector to the player
                    const directionVector = {x : this.playerReference.x - telegraph.x, y:this.playerReference.y - telegraph.y};
                    const positionVector = {x : telegraph.x, y: telegraph.y};
    
                    this.projectiles.push(new Projectile(this.drawLayer, this.playerReference, positionVector, 200, directionVector));
    
                    //destroy the telegraph entity
                    delete this.telegraphs[i];
                }
            }

        }





    }

    isDone(){

    }

}