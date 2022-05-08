'use strict';
class Vector{


    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(v1){
        return new Vector(this.x + v1.x, this.y + v1.y);
    }

    getNorm(){
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    //returns the angle formed with the x-axis from 0 to 2*PI
    getAngle(){

        let realY = -this.y;

        if (this.x === 0){
            return (realY >= 0) ? Math.PI/2 : 3 * Math.PI/2;
        }

        let  angle = Math.atan(realY / this.x);

        if (this.x < 0){
            angle += Math.PI;
        }

        if (angle < 0){
            angle = 2 * Math.PI + angle; 
        }


        return angle;
    }


    rescale(s){
        return new Vector(this.x * s, this.y * s);
    }

    dotProduct(v2){
        return this.x * v2.x + this.y * v2.y;
    }

    crossProdScalar(v2){
        return (this.x * v2.y) - (this.y * v2.x) 
    }

    normalize(){
        const norm = this.getNorm();
        if (norm === 0){
            return new Vector(0, 0);
        }
        return this.rescale(1/norm);
    }

    getNormalVect(){
        return new Vector(-1 * this.y, this.x);
    }

    //snaps to the closest 45° vector (or pi/4)
    snap45(){
        let angle = this.getAngle();

        if (angle - (Math.floor(angle / (Math.PI/4)) * (Math.PI/ 4)) <= Math.PI / 8){
            angle = Math.PI/4 * Math.floor(angle / (Math.PI/4));
        }
        else{
            angle =  Math.PI/4 * Math.ceil(angle / (Math.PI/4));
        }

        let vector = new Vector(Math.cos(angle), - Math.sin(angle));
        vector = vector.rescale(this.getNorm());

        return vector;


        // let directions= [];
        
        // for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI/4 ){
        //     directions.push(new Vector(Math.cos(theta), Math.sin(theta)));
        // }

        // let maxIndex = 0;
        // let maxProduct = 0;

        // for (let index = 0; index < directions.length;index ++){
        //     if (this.dotProduct(directions[index]) > maxProduct){
        //         maxProduct = this.dotProduct(directions[index]) ;
        //         maxIndex = index;
        //     }
        // }



        // return directions[maxIndex];
    }
    
}