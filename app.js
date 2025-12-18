const express = require("express");
const app = express();

var mysql = require("mysql2");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "food",
});

pool.query("SELECT * FROM users", function (error, results, fields) {
  if (error) throw error;
  console.log("the users are: ", results);
});

app.post("/login", (req, res) => {
  console.log("Hello");
  res.send("HI");
});

app.listen(3000);
