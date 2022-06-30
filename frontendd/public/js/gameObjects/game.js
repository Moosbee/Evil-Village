var object = [];
var changes = [];

$(document).ready(function () {
  $(".invis").hide();
  $("#info").hide();
  $("#Armee").hide();
  $("#Stadt").hide();
  $("#loose").hide();
  $("#send").hide();

  onloaded(makeitready);
});
async function makeitready() {
  console.log(document.benutzername);
  console.log(document.tokenid);

  $(".invis").show();

  var can = document.getElementById("game");
  var disp = can.getContext("2d");
  document.getElementById("audiofile").play();

  //can.addEventListener("click", handleClick, false);
  document.addEventListener("keydown", handlePress, false);
  document.addEventListener("click", handleClick, false);

  window.can = can;
  window.disp = disp;
  window.keyframe = 0;
  window.speed = 2;

  let dater = {
    id: document.tokenid,
  };

  setInterval(gameloop, 100);
  setInterval(keyframed, 150);
  setTimeout(function () {
    sockets();
  }, 201);

  const result = await fetch("/game/main", {
    method: "POST",
    body: JSON.stringify(dater),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resultText = await result.text();
  updateObject(resultText);
}

function sockets() {
  window.socket = io();

  socket.on("update", function (data) {
    // console.log(data);
    if (data == "END") {
      $("#loose").show();
    } else {
      updateObject(data);
    }
  });
}

async function senden() {
  console.log("sent");

  let stringchanges = JSON.stringify(changes);
  let dater = {
    id: document.tokenid,
    info: stringchanges,
  };
  console.log(dater);
  changes = [];

  const result = await fetch("/game/update", {
    method: "GET",
    body: JSON.stringify(dater),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(result);
  if (result == "END") {
    $("#loose").show();
  } else {
    updateObject(result);
  }

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

function updateObject(newObject) {
  // console.log(newObject);
  let newObjectJSON = JSON.parse(newObject);
  // console.log(newObjectJSON);
  let oldobject = Object.assign([], object);
  // console.log(oldobject);
  object = [];
  for (let i = 0; i < newObjectJSON.length; i++) {
    const element = newObjectJSON[i];
    let savedObject;
    switch (element.typeof.type) {
      case "saveArmy":
        savedObject = new armee(
          element.x,
          element.y,
          element.owner,
          element.size,
          element.id,
          element.typeof.gotox,
          element.typeof.gotoy,
          element.strength,
        );
        break;
      case "saveSchiff":
        savedObject = new schiff(
          element.x,
          element.y,
          element.owner,
          element.size,
          element.id,
          element.typeof.gotox,
          element.typeof.gotoy,
          element.strength,
        );
        break;
      case "saveStadt":
        savedObject = new stadt(
          element.x,
          element.y,
          element.owner,
          element.strength,
          element.id,
          element.typeof.capital,
          element.size,
          element.typeof.makingofarmy,
          element.typeof.speed,
          element.typeof.population,
        );
        break;
      default:
        continue;
        break;
    }

    let selectobject = oldobject.filter((e) => {
      return e.selected && e.id == element.id;
    });
    if (selectobject.length >= 1) {
      savedObject.selected = true;
    }

    object.push(savedObject);
  }
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

  let selectobject = object.filter((arm) => arm.selected);
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
    let selectobject = object.filter((arm) => arm.selected);
    for (let ist = 0; ist < selectobject.length; ist++) {
      let selected = selectobject[ist];
      selected.selected = false;
    }
  } else if (e.which === 13) {
    // Enter handler
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
    var mausx = ((e.clientX - rect.x) / window.can.offsetWidth) * 1000;
    var mausy = ((e.clientY - rect.y) / window.can.offsetHeight) * 1000;

    // console.log(mausx);
    // console.log(mausy);
    // console.log(can.width);
    // console.log(can.height);
    // let rgb = getmappixel(mausx, mausy);
    // console.log(rgb);

    for (let ist = 0; ist < object.length; ist++) {
      let arm = object[ist];

      if (
        arm.x > mausx - arm.size / 2 &&
        arm.x < mausx + arm.size / 2 &&
        arm.y > mausy - arm.size / 2 &&
        arm.y < mausy + arm.size / 2
      ) {
        arm.selected = true;
      } else {
        if (arm.selected) {
          if (arm.type == "armee" && arm.owner == document.tokenid) {
            //changes.push(new change(arm.id, mausx, mausy, arm.settele = false));
            socket.emit("update", {
              id: arm.id,
              gotox: mausx,
              gotoy: mausy,
              settle: false,
            });
            // arm.gotox = mausx;
            // arm.gotoy = mausy;
            // arm.a = 0;
            // arm.b = 0;
          }
        }
        arm.selected = false;
      }
    }
  } else {
    let selectobject = object.filter((arm) => arm.selected);
    for (let ist = 0; ist < selectobject.length; ist++) {
      let selected = selectobject[ist];
      selected.selected = false;
    }
  }
}

function settle() {
  console.log("settle");
  let selectobject = object.filter((arm) => arm.selected);
  if (selectobject.length == 0) {
    return;
  }
  for (let ist = 0; ist < selectobject.length; ist++) {
    if (selectobject[ist].type == "armee") {
      //changes.push(new change(selectobject[ist].id, -1, -1, selectobject[ist].settele = true));
      socket.emit("update", {
        id: selectobject[ist].id,
        x: undefined,
        y: undefined,
        settle: true,
      });
    }
  }
}
