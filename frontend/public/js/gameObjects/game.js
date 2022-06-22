
var object = [];
var changes = [];

$(document).ready(function () {
    $(".invis").hide();
    $("#info").hide();
    $("#Armee").hide();
    $("#Stadt").hide();
    $("#loose").hide();
    $("#send").hide();


    onloaded();
});
function makeitready() {
    console.log(document.vorname);
    console.log(document.nachname);
    console.log(document.benutzername);
    console.log(document.tokenid);

    setTimeout(function () { sockets(); }, 201);


    $(".invis").show();

    var can = document.getElementById("game");
    var disp = can.getContext('2d');
    document.getElementById('audiofile').play();

    setInterval(gameloop, 100);
    setInterval(keyframed, 150);

    //can.addEventListener("click", handleClick, false);
    document.addEventListener("keydown", handlePress, false);
    document.addEventListener("click", handleClick, false);

    window.can = can;
    window.disp = disp;
    window.keyframe = 0;
    window.speed = 2;

    let dater = {
        id: document.tokenid
    }
    $.ajax({
        url: "/game/main", type: 'POST',
        data: dater,
        success: function (result, status) {
            console.log(result);
            let res = JSON.parse(result);
            console.log(res);
            object = [];
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                if (element.type == "stadt") {
                    object.push(new stadt(element.x, element.y, element.owner, element.strength, element.id, element.capital, element.size, element.makingofarmy, element.speed, element.population));
                    object[object.length - 1].arraypos = object.length - 1;
                } else {
                    object.push(new armee(element.x, element.y, element.owner, element.size, element.id, element.gotox, element.gotoy, element.move, element.a, element.b, element.strength));
                    object[object.length - 1].arraypos = object.length - 1;
                }
            }
        }
    });
}


function sockets() {

    window.socket = io();

    socket.on('update', function (data) {
        console.log(data);
        if (data == "END") {
            $("#loose").show();
        } else {
            let res = JSON.parse(data);
            console.log(res);
            let obtemp = object;
            object = [];
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                let selectobject = obtemp.filter(arm => ((arm.id == element.id) && (arm.selected)));
                if (element.type == "stadt") {
                    object.push(new stadt(element.x, element.y, element.owner, element.strength, element.id, element.capital, element.size, element.makingofarmy, element.speed, element.population));
                    object[object.length - 1].arraypos = object.length - 1;
                } else {
                    object.push(new armee(element.x, element.y, element.owner, element.size, element.id, element.gotox, element.gotoy, element.move, element.a, element.b, element.strength));
                    object[object.length - 1].arraypos = object.length - 1;
                }

                if (selectobject.length != 0) {
                    object[object.length - 1].selected = true;
                }
            }
            let selectobject = obtemp.filter(arm => ((arm.owner == document.tokenid) && (arm.capital)));
            if (selectobject.length == 0) {
                if ($("#loose").is(":hidden")) {

                    senden();
                }
            }
        }

    });
}

function senden() {
    console.log("sent");

    let stringchanges = JSON.stringify(changes);
    let dater = {
        id: document.tokenid,
        info: stringchanges
    }
    console.log(dater);
    changes = [];

    $.ajax({
        url: "/game/getupdate", type: 'POST',
        data: dater,
        success: function (result, status) {
            console.log(result);
            if (result == "END") {
                $("#loose").show();
            } else {
                let res = JSON.parse(result);
                console.log(res);
                object = [];
                for (let index = 0; index < res.length; index++) {
                    const element = res[index];
                    if (element.type == "stadt") {
                        object.push(new stadt(element.x, element.y, element.owner, element.strength, element.id, element.capital, element.size, element.makingofarmy, element.speed, element.population));
                        object[object.length - 1].arraypos = object.length - 1;
                    } else {
                        object.push(new armee(element.x, element.y, element.owner, element.size, element.id, element.gotox, element.gotoy, element.move, element.a, element.b, element.strength));
                        object[object.length - 1].arraypos = object.length - 1;
                    }
                }
            }
        }
    });

    $("#Layer_1").css("transform", "translateX(0%)");
    let brief = document.getElementsByClassName("lay1");
    for (let i = 0; i < brief.length; i++) {
        brief[i].style.transform = "translateX(100%)";
    }
    setTimeout(function () {
        $("#Layer_1").css("transform", "translateX(-200%)");
        $(".lay1").css("transform", "translateX(0%)");
    }, 1000);

}

function gameloop() {
    draw();
}
function keyframed() {
    let key = window.keyframe;
    key = key + 1;
    if (key > 11) {
        key = 0;
    }
    window.keyframe = key;
}
function draw() {
    clear();

    let img = document.createElement("img");
    img.src = "/game/map";
    window.disp.drawImage(img, 0, 0, 1000, 1000);

    for (let sein = 0; sein < object.length; sein++) {
        let stadt = object[sein];

        //stadt.setarraypos(sein);
        //stadt.tick();
        stadt.drew();
        //stadt.remove();

    }

    let selectobject = object.filter(arm => (arm.selected));
    if (selectobject.length == 0) {
        $("#info").hide();
    }
    for (let ist = 0; ist < selectobject.length; ist++) {
        let selected = selectobject[ist];
        selected.infodraw();

    }

}


function clear() {
    window.disp.clearRect(0, 0, can.width, can.height);
}

function handlePress(e) {
    //Esc handler
    if (e.which === 27) {
        console.log("test");
        let selectobject = object.filter(arm => (arm.selected));
        for (let ist = 0; ist < selectobject.length; ist++) {
            let selected = selectobject[ist];
            selected.selected = false;

        }
    } else if (e.which === 13) {// Enter handler
        console.log("test");
        senden();
    }
}
function handlebodyClick(e) {
    console.log("tetetrs,ulfdit");
}
function handleClick(e) {

    console.log(e.target);

    if (e.target.id == "game") {

        var rect = window.can.getBoundingClientRect();
        var mausx = (e.clientX - rect.x) / window.can.offsetWidth * 1000;
        var mausy = (e.clientY - rect.y) / window.can.offsetHeight * 1000;

        // console.log(mausx);
        // console.log(mausy);
        // console.log(can.width);
        // console.log(can.height);
        // let rgb = getmappixel(mausx, mausy);
        // console.log(rgb);

        for (let ist = 0; ist < object.length; ist++) {
            let arm = object[ist];

            if (((arm.x > (mausx - (arm.size / 2))) && (arm.x < (mausx + (arm.size / 2)))) && ((arm.y > (mausy - (arm.size / 2))) && (arm.y < (mausy + (arm.size / 2))))) {
                arm.selected = true;
            } else {
                if (arm.selected) {

                    if (arm.type == "armee" && arm.owner == document.tokenid) {
                        //changes.push(new change(arm.id, mausx, mausy, arm.settele = false));
                        socket.emit("putupdate", { id: arm.id, x: mausx, y: mausy, settele: false });
                        // arm.gotox = mausx;
                        // arm.gotoy = mausy;
                        // arm.a = 0;
                        // arm.b = 0;
                    }
                }
                arm.selected = false;
            }
        }
    }
    else {
        let selectobject = object.filter(arm => (arm.selected));
        for (let ist = 0; ist < selectobject.length; ist++) {
            let selected = selectobject[ist];
            selected.selected = false;

        }
    }
}

function settle() {
    console.log("settle");
    let selectobject = object.filter(arm => (arm.selected));
    if (selectobject.length == 0) {
        return;
    }
    for (let ist = 0; ist < selectobject.length; ist++) {
        if (selectobject[ist].type == "armee") {
            //changes.push(new change(selectobject[ist].id, -1, -1, selectobject[ist].settele = true));
            socket.emit("putupdate", { id: selectobject[ist].id, x: -1, y: -1, settele: true });
        }
    }
}
