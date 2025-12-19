// SQL create table
let mysql = require("mysql2");
let config = require("../config");
let util = require("util");

let con = mysql.createConnection(config.db);
let query = util.promisify(con.query).bind(con); // will return a promise

let tablesToMake = [
  `CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(40) NOT NULL
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS Recipe (
  recipe_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  ingredients TEXT NOT NULL,
  people INT NOT NULL,
  max_cook_time INT NOT NULL,
  notes TEXT,
  recipe_text TEXT NOT NULL,
  rating INT,
  comment TEXT,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS Contain (
  recipe_id INT NOT NULL,
  ing_id INT NOT NULL,
  PRIMARY KEY (recipe_id, ing_id),
  FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (ing_id) REFERENCES Ingredient(ing_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB`,
];


async function createTables() {
  try {
    console.log(" Connection to MySQL successfull\n");

    for (
      let currentTable = 0;
      currentTable < tablesToMake.length;
      currentTable++
    ) {
      await query(tablesToMake[currentTable]);
      console.log(`Table ${currentTable + 1}/${tablesToMake.length} created`);
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
