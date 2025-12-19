// SQL create table
let mysql = require("mysql");
let config = require("../config");
let util = require("util");

let con = mysql.createConnection(config.db);
let query = util.promisify(con.query).bind(con); // will return a promise

let tablesToMake = [
  `CREATE TABLE IF NOT EXISTS Users (
    id_u INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(40) NOT NULL
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS Ingredient (
    id_i INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS Recipe (
    id_r INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TEXT,
    comment TEXT,
    cooking_time TINYINT UNSIGNED,
    grade TINYINT UNSIGNED,
    people TINYINT,
    CONSTRAINT chk_grade CHECK (grade BETWEEN 0 AND 10),
    CONSTRAINT chk_people CHECK (people > 0),
    id_u INT NOT NULL,
    FOREIGN KEY (id_u) REFERENCES Users(id_u) 
      ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS Contain (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_r INT NOT NULL,
    id_i INT NOT NULL,
    FOREIGN KEY (id_r) REFERENCES Recipe(id_r) 
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_i) REFERENCES Ingredient(id_i) 
      ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE=InnoDB`
];

async function createTables() {
  try {
    console.log(" Connection to MySQL successfull\n");

    for (let currentTable = 0; currentTable < tablesToMake.length; currentTable++) {
      await query(tablesToMake[currentTable]);
      console.log(`Table ${currentTable+ 1}/${tablesToMake.length} created`);
    }

    console.log("\n All tables have been successfully created !");
    con.end();

  } catch (err) {
    console.error("Erreur:", err.message);
    con.end();
  }
}

con.connect(function (err) {
  if (err) throw err;
  createTables();
});