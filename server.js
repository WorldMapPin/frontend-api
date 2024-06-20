const express = require("express");
// const logger = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
// Exported routers
const routers = require("./routes/index");

const bodyParserLimit = "100mb";
//Middlewares
// app.use(logger("combined"));
app.use(bodyParser.json({ limit: bodyParserLimit }));
app.use(bodyParser.urlencoded({ extended: false, limit: bodyParserLimit }));
app.use(helmet());
app.use(cors());

// Routes
routers.forEach((router) => {
  app.use(router.path, router.handler);
});

//Catch 404 Errors and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  return next(err);
});

//Error handler
app.use((err, req, res, next) => {
  const error = err; //app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  //Respond to self
  console.error(err);

  //Respond to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

//Start server
const port = process.env.MAIN_PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
