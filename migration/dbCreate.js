let mysql = require("mysql2");
let config = require("../config");

const dbConfig = { ...config.db };
delete dbConfig.database;

let con = mysql.createConnection(dbConfig);

con.connect(function (err) {
  if (err) throw err;
  console.log("Connexion to MySQL successful");
  let SQLQuery = "CREATE DATABASE IF NOT EXISTS  craftdinner";
  con.query(SQLQuery, (err, result) => {
    if (err) throw err;
    console.log("Database successfully created");
  });
});
