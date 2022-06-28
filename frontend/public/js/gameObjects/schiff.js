class schiff {
  constructor(x, y, owner, size = 50, id, gotox = -1, gotoy = -1, strength = -1) {
    this.type = "schiff";
    this.id = id;
    this.arraypos = 0;
    this.owner = owner;
    this.selected = false;
    this.size = size;
    this.x = x;
    this.y = y;
    this.xsim = x;
    this.ysim = y;
    if (gotox == -1 && gotoy == -1) {
      this.gotox = x;
      this.gotoy = y;
    } else {
      this.gotox = gotox;
      this.gotoy = gotoy;
    }

    if (x == gotox && y == gotoy) {
      this.move = false
    } else {
      this.move = true
    }

    this.move = move;
    this.strength = strength;
    let min = 1;
    let max = 25;
    if (strength == -1) {
      this.strength = Math.floor(Math.random() * (max - min)) + min;
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
    tick() {
        if ((this.x == this.gotox) && (this.y == this.gotoy)) {
            return;
        }

        if (((this.xsim > (this.gotox - 5)) && (this.xsim < (this.gotox + 5))) && ((this.ysim > (this.gotoy - 5)) && (this.ysim < (this.gotoy + 5)))) {
            this.xsim = this.gotox;
            this.ysim = this.gotoy;
            this.movesim = false;
            console.log("Angekommen");
            return;
        }

        this.movesim = true;

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
            a = a * window.speed;
            b = b * window.speed;

            this.a = a;
            this.b = b;
            this.xsim = this.xsim + b;
            this.ysim = this.ysim - a;
        } else {

            let rgb = getmappixel(this.xsim, this.ysim);
            if ((rgb[0] == 0) && (rgb[1] == 0) && (rgb[2] == 255) && (rgb[3] == 255)) {
                this.xsim = this.xsim + this.b * 0.5 * ((1 / this.strength) + 1);
                this.ysim = this.ysim - this.a * 0.5 * ((1 / this.strength) + 1);
            } else if ((rgb[0] == 125) && (rgb[1] == 255) && (rgb[2] == 125) && (rgb[3] == 255)) {
                this.xsim = this.xsim + this.b * 0.75 * ((1 / this.strength) + 1);
                this.ysim = this.ysim - this.a * 0.75 * ((1 / this.strength) + 1);
            } else if ((rgb[0] == 188) && (rgb[1] == 255) && (rgb[2] == 188) && (rgb[3] == 255)) {
                this.xsim = this.xsim + this.b * 0.5 * ((1 / this.strength) + 1);
                this.ysim = this.ysim - this.a * 0.5 * ((1 / this.strength) + 1);
            } else if ((rgb[0] == 220) && (rgb[1] == 255) && (rgb[2] == 220) && (rgb[3] == 255)) {
                this.xsim = this.xsim + this.b * 0.25 * ((1 / this.strength) + 1);
                this.ysim = this.ysim - this.a * 0.25 * ((1 / this.strength) + 1);
            } else {
                this.xsim = this.xsim + this.b * ((1 / this.strength) + 1);
                this.ysim = this.ysim - this.a * ((1 / this.strength) + 1);
            }

        }

    }


    drew() {
        let size = this.size;
        let img = document.createElement("img");

        if (this.move) {
            window.disp.fillStyle = "#FFF000";
            window.disp.fillRect(this.gotox, this.gotoy, 5, 5);
        }
        if (this.selected) {
            window.disp.fillStyle = "#FF0000";
            window.disp.fillRect(this.x - size / 2, this.y - size / 2, size, size);
        } else {
            window.disp.fillStyle = "#00FF00";
        }
        if (this.move) {
            if (this.x > this.gotox) {
                img.src = "/media/images/schiff_walking_left.png";
            } else {
                img.src = "/media/images/schiff_walking_right.png";
            }
            let sx = 0;
            let sy = 0;
            let key = window.keyframe;

            key = key + 1;
            if (key % 4 == 0) {
                sy = 0;
            } else if (key % 4 == 1) {
                sy = 100;
            } else if (key % 4 == 2) {
                sy = 200;
            } else if (key % 4 == 3) {
                sy = 300;
            } else {
                sy = 0;
            }

            window.disp.drawImage(img, sx, sy, 100, 100, this.x - size / 2, this.y - size / 2, size, size);

            // if (this.selected) {
            //     window.disp.fillStyle = "#ff7b00";
            //     window.disp.fillRect(this.xsim - size / 2, this.ysim - size / 2, size, size);
            //     window.disp.drawImage(img, sx, sy, 100, 100, this.xsim - size / 2, this.ysim - size / 2, size, size);
            // }



        } else {
            img.src = "/media/images/schiff.png";
            window.disp.drawImage(img, this.x - size / 2, this.y - size / 2, size, size);
        }

    }
    infodraw() {
        if (this.selected) {
            $("#info").show();
            $("#Armee").show();
            $("#Stadt").hide();
            $(".strength").html(this.strength);
            $(".speed").html(this.speed);
            if (this.owner == document.tokenid) {
                $(".owner").html("Du");
            } else {
                $(".owner").html("Nicht du");
            }
            $(".x").html(this.x);
            $(".y").html(this.y);
            $(".gotox").html(this.gotox);
            $(".gotoy").html(this.gotoy);
        }
    }
}
