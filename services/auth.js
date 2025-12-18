const db = require("./db");

async function login(username, password) {
  const rows = await db.query(
    "SELECT * FROM users WHERE user_name = ? AND password = ? LIMIT 3",
    [username, password]
  );

  if (!rows || rows.length === 0) return null;

  return rows[0];
}

module.exports = { login };
