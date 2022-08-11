class stadt {
    constructor(x, y, owner, strength = -1, id = -1, capital = false, size = 40, makingofarmy = 500, speed = -1, population = -1) {
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
        this.makingofarmysim = makingofarmy;
        this.speed = speed;
        this.population = population;
        if (strength == -1) {
            this.strength = 1;
            let min = 1;
            let max = 6;
            this.speed = Math.floor(Math.random() * (max - min)) + min;
            min = 1;
            max = 101;
            this.population = Math.floor(Math.random() * (max - min)) + min;
            if (capital) {
                this.capital = capital;
                this.size = 60;
                min = 400;
                max = 500;
                this.strength = Math.floor(Math.random() * (max - min)) + min;
                min = 750;
                max = 1000;
                this.population = Math.floor(Math.random() * (max - min)) + min;

            }
        }
    }

    setarraypos(a) {
        this.arraypos = a;
    }
    remove() {
        if (this.strength <= 0) {
            object.splice(this.arraypos, 1);
        }
    }

    tick(){
        if (this.makingofarmysim >= 0) {
            this.makingofarmysim = this.makingofarmysim - 1;
        }
    }

    drew() {
        let size = this.size;
        let img = document.createElement("img");

        if (this.selected) {
            window.disp.fillStyle = "#FF0000";
            window.disp.fillRect(this.x - size / 2, this.y - size / 2, size, size);
        } else {
            window.disp.fillStyle = "#00FF00";
        }
        if (this.capital) {
            img.src = "/media/images/capital.png";
        } else {
            img.src = "/media/images/stadt.png";
        }
        window.disp.drawImage(img, this.x - size / 2, this.y - size / 2, size, size);
    }

    infodraw() {
        if (this.selected) {
            $("#info").show();
            $("#Armee").hide();
            $("#Stadt").show();
            $(".strength").html(this.strength);
            $(".speed").html(this.speed);
            if (this.owner == document.tokenid) {
                $(".owner").html("Du");
            } else {
                $(".owner").html("Nicht du");
            }
            $(".x").html(this.x);
            $(".y").html(this.y);
            $(".population").html(this.population);
            $(".makingofarmy").html(this.makingofarmy);
            $(".makingofarmysim").html(this.makingofarmysim);
        }
    }
}

