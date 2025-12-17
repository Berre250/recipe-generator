let mysql = require("mysql");
let config = require("../config");

let con = mysql.createConnection(config.db); // crée connection mySQL

con.connect(function (err) {
  if (err) throw err;
  console.log("Connexion to MySQL successful");
  con.query("CREATE DATABASE IF NOT EXISTS craftdinner", function (err, result){
        if (err) throw err;
        console.log("Database created");
    })
})