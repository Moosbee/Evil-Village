const stadt = require("./serverstadt");

module.exports = class schiff {
    constructor(x, y, owner, strength = -1, id = -1, size = 50, gotox = -1, gotoy = -1, move = false, a = 0, b = 0) {
        this.arraypos = 0;
        this.id = id;
        this.strength = strength;
        this.owner = owner;
        this.selected = false;
        this.size = size;
        this.x = x;
        this.y = y;
        this.type = "schiff";
        let min = 1;
        let max = 25000;
        if (id == -1) {
            this.id = Math.floor(Math.random() * (max - min)) + min;
        }
        if (gotox == -1 && gotoy == -1) {
            this.gotox = x;
            this.gotoy = y;
        } else {
            this.gotox = gotox;
            this.gotoy = gotoy;
        }
        this.move = move;
        this.a = a;
        this.b = b;
        min = 10;
        max = 35;
        if (strength == -1) {
            this.strength = Math.floor(Math.random() * (max - min)) + min;
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

        let selectobject = object.filter(arm => (arm.type == "stadt" && (((this.x > (arm.x - (this.size / 2))) && (this.x < (arm.x + (this.size / 2)))) && ((this.y > (arm.y - (this.size / 2))) && (this.y < (arm.y + (this.size / 2)))))));
        if (selectobject.length > 0) {
            selectobject[0].strength = selectobject[0].strength + this.strength;
            selectobject[0].makingofarmy = 100;
            this.strength = -1;
            console.log("Merge");
            return;
        }

        if (this.strength > 500) {

            let min = this.strength - 100;
            let max = this.strength + 100;
            let population = Math.floor(Math.random() * (max - min)) + min;
            object.push(new stadt(this.x, this.y, this.owner, false, this.strength, -1, 40, 500, -1, population));
            object[object.length - 1].arraypos = object.length - 1;

            this.strength = -1;
        } else {
            console.log("fehlgeschlagen");
        }

    }

    goto(gotox, gotoy) {
        this.gotox = gotox;
        this.gotoy = gotoy;
        this.a = 0;
        this.b = 0;
    }

    tick() {
        let utileties = require("./serverutilities");
        this.strength = this.strength + 1 / 1000;
        if ((this.x == this.gotox) && (this.y == this.gotoy)) {
            return;
        }

        if (((this.x > (this.gotox - 5)) && (this.x < (this.gotox + 5))) && ((this.y > (this.gotoy - 5)) && (this.y < (this.gotoy + 5)))) {
            this.x = this.gotox;
            this.y = this.gotoy;
            this.move = false;
            console.log("Angekommen");
            return;
        }
        this.move = true;

        let selectobject = object.filter(arm => (((this.x > (arm.x - (this.size / 2))) && (this.x < (arm.x + (this.size / 2)))) && ((this.y > (arm.y - (this.size / 2))) && (this.y < (arm.y + (this.size / 2))))));


        for (let ist = 0; ist < selectobject.length; ist++) {
            let arm = selectobject[ist];
            if (this.arraypos == arm.arraypos) {
                continue;
            }
            if (this.owner == arm.owner) {

                if (arm.type == "stadt") {
                    continue;
                }
                console.log("merge");
                if (this.strength < arm.strength) {
                    arm.strength = arm.strength + this.strength;
                    this.strength = -1;
                } else if (this.strength > arm.strength) {
                    this.strength = this.strength + arm.strength;
                    arm.strength = -1;
                } else {
                    this.strength = this.strength + arm.strength;
                    arm.strength = -1;
                }
                continue;
            }

            console.log("Kampf");
            if (this.strength != arm.strength) {
                let strengthtthis = this.strength;
                let strengthtarm = arm.strength;
                this.strength = this.strength - strengthtarm;
                arm.strength = arm.strength - strengthtthis;
            } else {
                this.strength = -1;
                arm.strength = -1;
                console.log("Unentschieden");
            }


        }


        if (this.a == 0 && this.b == 0) {
            console.log("startwalk");
            let a = (this.y - this.gotoy);
            let b = -(this.x - this.gotox);
            let alpha = Math.atan2(a, b);//G/A
            if (a < 0) {
                alpha = 2 * Math.PI + alpha;
            }

            a = Math.sin(alpha);
            b = Math.cos(alpha);
            a = a * global.speed;
            b = b * global.speed;

            this.a = a;
            this.b = b;
            this.x = this.x + b;
            this.y = this.y - a;
        } else {


            let rgb = utileties.getmappixel(this.x, this.y);
            if ((rgb[0] == 0) && (rgb[1] == 0) && (rgb[2] == 255) && (rgb[3] == 255)) {
                this.x = this.x + this.b * 0.5 * ((1 / this.strength) + 1);
                this.y = this.y - this.a * 0.5 * ((1 / this.strength) + 1);
            } else if ((rgb[0] == 125) && (rgb[1] == 255) && (rgb[2] == 125) && (rgb[3] == 255)) {
                this.x = this.x + this.b * 0.75 * ((1 / this.strength) + 1);
                this.y = this.y - this.a * 0.75 * ((1 / this.strength) + 1);
            } else if ((rgb[0] == 188) && (rgb[1] == 255) && (rgb[2] == 188) && (rgb[3] == 255)) {
                this.x = this.x + this.b * 0.5 * ((1 / this.strength) + 1);
                this.y = this.y - this.a * 0.5 * ((1 / this.strength) + 1);
            } else if ((rgb[0] == 220) && (rgb[1] == 255) && (rgb[2] == 220) && (rgb[3] == 255)) {
                this.x = this.x + this.b * 0.25 * ((1 / this.strength) + 1);
                this.y = this.y - this.a * 0.25 * ((1 / this.strength) + 1);
            } else {
                this.x = this.x + this.b * ((1 / this.strength) + 1);
                this.y = this.y - this.a * ((1 / this.strength) + 1);
            }

        }

    }
}
