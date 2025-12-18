let mysql = require("mysql");
let config = require("../config");

// user: root, password: "root" for MAMP, nothing for WAMP
let con = mysql.createConnection(config.initDb);

con.connect(function (err) {
  if (err) throw err;
  console.log("Connexion to MySQL successful");
  let SQLQuery = "CREATE DATABASE IF NOT EXISTS " + config.db.database;
  con.query(SQLQuery, (err, result) => {
    if (err) throw err;
    console.log("Database successfully created");
  });
});