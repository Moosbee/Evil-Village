// get the client
const mysql = require('mysql2');
 
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'server',
  password: '123456789',
  database: 'schulprojekt'
});
 
// simple query
var anfrag="SELECT vorname,nachname FROM `users` WHERE benutzername='Moosbee'";
connection.query(anfrag,(err, results) => {
      if(err){
        console.log(err);
        return;
      }
      console.log(results); // results contains rows returned by server
      console.log(results[0]);
      console.log(results[0]["vorname"]);

    }
);
 
console.log("test");
