"use strict";
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 80;

const http = require("http").Server(app);
const io = require("socket.io")(http);

//Mysql
const mysql = require("mysql2");
// create the connection to database

let configuration = fs.readFileSync("./config.json", "utf-8");

global.configur = JSON.parse(configuration);

const game = require("./game/game");

import { createUser, verify } from "./backend/auth";

app.use("/media", express.static("public"));

//Server aktivieren-----------------------------------------------

app.use(bodyParser.urlencoded({ extended: true }));
app.all("*", function (req, res, next) {
  console.log(req.method + " Anfrage " + req.url);
  next(); // pass control to the next handler
});

//Handeling anfragen-----------------------------------------------

game.httplistener(app);

app.get("/", (req, res) => {
  res.sendFile("./unpublic/home.html");
});

app.get("/login", (req, res) => {
  res.sendFile("./unpublic/login.html");
});

//fuer einloggen benutze Node.js Passport
app.post("/login", (req, res) => {
  //console.log(req.body);
  let resiveddata = req.body;

  let erg = verify(resiveddata["usernamefld"], resiveddata["passwordfld"]);

  if (typeof erg == "number") {
    let sent: number = erg;
    res.send(JSON.stringify(
      {
        "state":"success",
        "id":sent
      }
    ));
  } else if (erg == "wrong") {
    res.send('{"state":"wrong"}');
  } else if (erg == "failed") {
    res.send('{"state":"failed"}');
    return;
  } else {
    res.send('{"state":"failed"}');
    return;
  }
});

app.get("/makeuser", (req, res) => {
  res.sendFile("./unpublic/makeuser.html");
});

app.post("/makeuser", (req, res) => {
  // console.log(req.body);
  let resiveddata = req.body;

  let erg = createUser(resiveddata["usernamefld"], resiveddata["passwordfld"]);

  if (typeof erg == "number") {
    let sent: number = erg;
    res.send(JSON.stringify(
      {
        "state":"success",
        "id":sent
      }
    ));
  } else if (erg == "taken") {
    res.send('{"state":"taken"}');
  } else if (erg == "failed") {
    res.send('{"state":"failed"}');
    return;
  } else {
    res.send('{"state":"failed"}');
    return;
  }

  let anfrag =
    "SELECT benutzername FROM `users` WHERE benutzername='" +
    resiveddata["usernamefld"] +
    "'";
  connection.query(anfrag, (err, results) => {
    if (results.length == 0) {
      anfrag =
        "INSERT INTO `users` (`id`, `vorname`, `nachname`, `benutzername`, `passwort`) VALUES (NULL, '" +
        resiveddata["firstnamefld"] +
        "', '" +
        resiveddata["lastnamefld"] +
        "', '" +
        resiveddata["usernamefld"] +
        "', '" +
        resiveddata["passwordfld"] +
        "')";
      connection.query(anfrag, (err, results) => {
        if (err) {
          console.log(err);
          res.send('{"state":"failed"}');
          return;
        }

        anfrag =
          "SELECT id, vorname, nachname, benutzername FROM `users` WHERE benutzername='" +
          resiveddata["usernamefld"] +
          "'";
        connection.query(anfrag, (err, results) => {
          if (err) {
            console.log(err);
            res.send('{"state":"failed"}');
            return;
          }
          let sent = results[0];
          sent["state"] = "success";
          console.log(sent);
          console.log(JSON.stringify(sent));
          res.send(JSON.stringify(sent));
        });
      });
    } else {
      res.send('{"state":"taken"}');
    }
  });
});

app.get("/logedin", (req, res) => {
  res.sendFile("./unpublic/logedin.html");
});

app.get("/shutdown", (req, res) => {
  res.send('<h1 color="red">Shutdown</h1>');
  game.end(0);
});

app.get("/favicon.ico", (req, res) => {
  console.log("favicon");
  let faf = global.configur.favicon;
  let dir = "./unpublic/farvi/" + faf + ".ico";
  res.sendFile(dir);
});

//Socket.io ----------------------------------------------------

//Whenever someone connects this gets executed
io.on("connection", function (socket) {
  console.log("A user connected");

  socket.on("test", function () {
    console.log("A user tested");
  });

  socket.on("putupdate", function (data) {
    console.log(data);
    let selectobject = object.filter((arm) => arm.id == data.id);

    if (!(data.x == -1 && data.y == -1)) {
      selectobject[0].goto(data.x, data.y);
    }

    if (data.settele) {
      selectobject[0].settle();
    }
  });

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

setInterval(() => {
  let info = JSON.stringify(object);
  io.emit("update", info);
  //console.log("tetetw");
}, 100);

//Server chatch -------------------------------------------------

app.all("*", function (req, res, next) {
  try {
    console.log(req);
    res.status(400).send("<h1>Error</h1>");
    console.log("An Idiot has a typo!");
  } catch (error) {
    console.log(error);
  }
  next(); // pass control to the next handler
});

http.listen(port, () => {
  console.log(`Schulprojekt listening on port ${port}!`);
  game.start();
});
