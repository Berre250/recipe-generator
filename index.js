const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const ingredientsRoute = require("./routes/ingredients");
const recipeGenerateRoute = require("./routes/recipesGenerate");

const corsOption = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//app.get("/login", function (req, res) {
//res.send("bienvenue a hetic");
//});

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/api/ingredients", ingredientsRoute);
app.use("/api/recipes", recipeGenerateRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Server launched on port ${port}`);
});

//var server = app.listen(8081, function () {
//var host = server.address().address;
//var port = server.address().port;
//console.log(`Example server listening at http://${host}:${port}`);
//});

app.use(express.static("public"));
