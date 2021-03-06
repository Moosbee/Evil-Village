"use strict";
const fs = require("fs");


const armee = require("./serveronly/serverarmee");
const stadt = require("./serveronly/serverstadt");
const utileties = require("./serveronly/serverutilities");

exports.httplistener = function (browser) {

    browser.get('/game/main', (req, res) => {
        fs.readFile("./game/html/maingameframe.html", "utf-8", (err, data) => {
            if (err) {
                res.status(500).send('<h1>Error</h1>');
            }
            res.send(data);
        });
    });

    browser.get('/game/config', (req, res) => {
        fs.readFile("./game/html/config.html", "utf-8", (err, data) => {
            if (err) {
                res.status(500).send('<h1>Error</h1>');
            }
            res.send(data);
        });
    });

    browser.get('/game/map', (req, res) => {
        let map = "./game/maps/map";
        let number = configur.Game.Map;
        map = map + number + ".png"
        fs.readFile(map, (err, data) => {
            if (err) {
                res.status(500).send('<h1>Error</h1>');
            }
            res.send(data);
        });
    });

    browser.post('/game/main', (req, res) => {

        let resiveddata = req.body;

        console.log(resiveddata);
        if (resiveddata["id"] == undefined) {
            res.send("<h1>Error</h1>");
            return;
        } else {
            let idd = resiveddata["id"];
            let selectobject = object.filter(arm => (arm.owner == idd && arm.capital == true));
            if (selectobject.length == 0) {
                let min = 75;
                let max = 930;
                let x = Math.floor(Math.random() * (max - min)) + min;
                let y = Math.floor(Math.random() * (max - min)) + min;


                object.push(new stadt(x, y, resiveddata["id"], true));
                object[object.length - 1].arraypos = object.length - 1;
            }
        }

        res.send(JSON.stringify(object));

    });

    browser.post('/game/getupdate', (req, res) => {

        let resiveddata = req.body;
        let selectobject = object.filter(arm => ((arm.owner == resiveddata["id"]) && (arm.capital == true)));

        if (selectobject.length > 0) {

            selectobject[0].search = selectobject[0].search - 50;
            if (selectobject[0].search < 0) {
                res.send("END");
                selectobject[0].strength = -1;
                return;
            }
        } else {
            res.send("END");
            return;
        }

        console.log(resiveddata);
        if (resiveddata['info'] != '[]') {
            let info = resiveddata['info'];
            changes = JSON.parse(info);
            for (let i = 0; i < changes.length; i++) {
                let chang = changes[i];
                let selectobject = object.filter(arm => (arm.id == chang.id));

                if (!((chang.gotox == -1) && (chang.gotoy == -1))) {
                    selectobject[0].goto(chang.gotox, chang.gotoy);
                }

                if (chang.settele) {
                    selectobject[0].settle();
                }

            }
        }
        setTimeout(function () { res.send(JSON.stringify(object)); }, 101);

    });

}

exports.start = function () {

    global.object = [];
    global.speed = 2;

    utileties.setmap();

    

        fs.readFile('./save.json', (err, data) => {
            if (err) throw err;

            if (data == "" || global.configur.Game.ResetOnStart) {
                data = "[]";
            }
            let res = JSON.parse(data);
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                if (element.type == "stadt") {
                    if (element.search) {
                        object.push(new stadt(element.x, element.y, element.owner, element.capital, element.strength, element.id, element.size, element.makingofarmy, element.speed, element.population, element.search));

                    } else {
                        object.push(new stadt(element.x, element.y, element.owner, element.capital, element.strength, element.id, element.size, element.makingofarmy, element.speed, element.population));

                    }
                    object[object.length - 1].arraypos = object.length - 1;
                } else {
                    object.push(new armee(element.x, element.y, element.owner, element.strength, element.id, element.size, element.gotox, element.gotoy, element.move, element.a, element.b));
                    object[object.length - 1].arraypos = object.length - 1;
                }
            }

            console.log(object);
            setInterval(gameloop, 100);
            setInterval(save, 5000);
            console.log("Game Startet");
        });
    

}

exports.end = function (a) {
    let data = JSON.stringify(global.object);
    console.log(data);
    fs.writeFile('./save.json', data, function (err) {
        if (err) throw err;
        console.log('Saved!');
        process.exit(a);
    });
}

function save() {
    let data = JSON.stringify(global.object);
    fs.writeFile('./save.json', data, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}


function gameloop() {
    //console.log("Looped");

    for (let sein = 0; sein < object.length; sein++) {
        let stadt = object[sein];

        stadt.setarraypos(sein);
        stadt.tick();
        //stadt.drew();
        stadt.remove();

    }

}




