const express = require("express");
const indexRouter = express.Router();
const markersRouter = require("./markers");

/* GET home page. */
indexRouter.get("/", function (req, res, next) {
    return res.send("worldmappin api V1");
});

indexRouter.post("/", function (req, res, next) {
    return res.send({ title: "worldmappin-api" });
});

const routers = [
    {
        path: "/",
        handler: indexRouter,
    },
    {
        path: "/marker",
        handler: markersRouter,
    },
]

module.exports = routers;
