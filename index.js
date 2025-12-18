const express = require("express");
const cors = require("cors"); //création d’une nouvelle instance d’express
const app = express();
const port = 3000;
//const usersRouter = require("./routes/users");

const corsOption = {
  origin: "*",
  Credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOption));

app.use(express.json()); //specifies JSON format
app.use(
  express.urlencoded({
    extended: true,
  })

);

//gestion d'erreur
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack); // renvoie l'erreur err.stack 
  res.status(statusCode).json({ message: err.message }); // on récupère l'erreur dans un JSON
  return;
});


app.listen(port, () => {
  console.log(` Server launched on port ${port}.`);
});



// let server = app.listen(3000, function () {
//   let host = server.address().address;
//   let port = server.address().port;

//   console.log("Example app listening at http://%s:%s", host, port);
// });

app.use(express.static("public")); // let the public folder be seen by anyone
