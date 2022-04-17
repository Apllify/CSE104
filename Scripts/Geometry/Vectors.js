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
    
}