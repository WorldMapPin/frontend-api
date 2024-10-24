const express = require("express");
const indexRouter = express.Router();
const markersRouter = require("./markers");

const pool = require("../helpers/connection");

/* GET home page. */
indexRouter.get("/", function (req, res, next) {
    return res.send("worldmappin api V1");
});

indexRouter.post("/", function (req, res, next) {
    return res.send({ title: "worldmappin-api" });
});

indexRouter.get("/ranking", async function (req, res, next) {
    console.log("enter getRanking")
    try {
        const query = `
        SELECT
            ROW_NUMBER() OVER ( ORDER BY COUNT(*) DESC ) AS 'rank',
            username,
            COUNT(*) AS tds
        FROM
            markerinfo
        WHERE
            isCurated = 1 AND isDigested > 0 AND postQuality > 0
        GROUP BY
            username
        ORDER BY
            COUNT(*) DESC
        `
        const rows = await pool.query(query)
        return res.json(rows);
    } catch(e) {
        console.error(e)
        return res.status(500).json({msg : "getRanking failed", error: e.message});
    }
})

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
