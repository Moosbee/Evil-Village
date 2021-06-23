module.exports = class stadt {
    constructor(x, y, owner, capital = false, strength = -1, id = -1, size = 40, makingofarmy = 500, speed = -1, population = -1,search=-1) {
        this.type = "stadt";
        this.id = id;
        this.arraypos = 0;
        this.owner = owner;
        this.selected = false;
        this.strength = strength;
        this.size = size;
        this.capital = capital;
        this.x = x;
        this.y = y;
        this.makingofarmy = makingofarmy;
        this.speed = speed;
        this.population = population;
        if(search!=-1){
            this.search=search;
        }
        if (strength == -1) {
            this.strength = 1;
            let min = 1;
            let max = 6;
            this.speed = Math.floor(Math.random() * (max - min)) + min;
            min = 1;
            max = 101;
            this.population = Math.floor(Math.random() * (max - min)) + min;
            min = 1;
            max = 25000;
            if (id == -1) {
                this.id = Math.floor(Math.random() * (max - min)) + min;
            }
            if (capital) {
                this.capital = capital;
                this.size = 60;
                min = 40;
                max = 50;
                this.strength = Math.floor(Math.random() * (max - min)) + min;
                min = 750;
                max = 1000;
                this.population = Math.floor(Math.random() * (max - min)) + min;
                this.search=500;
            }
        }
    }

    setarraypos(a) {
        this.arraypos = a;
    }
    remove() {
        if (this.strength <= 0 || this.x <= 0 || this.y <= 0 || this.x >= 1000 || this.y >= 1000) {
            object.splice(this.arraypos, 1);
        }
    }
    settle() {

    }

    tick() {
        let armee = require("./serverarmee");
        this.makingofarmy = this.makingofarmy - 1;
        if (this.makingofarmy < 0) {
            this.makingofarmy = (Math.floor(Math.random() * (1000 - 100)) + 100)+this.strength/2;
            if(this.capital){
                this.makingofarmy = (Math.floor(Math.random() * (1000 - 100)) + 100)+this.strength/2;
            }
            let max = 150;
            let min = -150;
            let x = Math.floor(Math.random() * (max - min)) + min;
            let y = Math.floor(Math.random() * (max - min)) + min;
            object.push(new armee(this.x, this.y, this.owner));
            object[object.length - 1].arraypos = object.length - 1;
            object[object.length - 1].gotox = this.x + x;
            object[object.length - 1].gotoy = this.y + y;
            min = this.strength- this.strength/25;
            max = this.strength+this.strength/20;
            object[object.length - 1].strength = Math.floor(Math.random() * (max - min)) + min;
            if((this.strength/2)>this.population){
                object[object.length - 1].strength=object[object.length - 1].strength;
                let max = 150;
                let min = -150;
                let x = Math.floor(Math.random() * (max - min)) + min;
                let y = Math.floor(Math.random() * (max - min)) + min;
                object.push(new armee(this.x+100, this.y+100, this.owner));
                object[object.length - 1].arraypos = object.length - 1;
                object[object.length - 1].gotox = this.x + x;
                object[object.length - 1].gotoy = this.y + y;
                min = this.strength- this.strength/25;
                max = this.strength+this.strength/20;
                object[object.length - 1].strength = (Math.floor(Math.random() * (max - min)) + min)/2;
            }
            
        }
        if(this.capital){
            if(this.search<500){
            this.search=this.search+2;
            }
        }
    }

}

