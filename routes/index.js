const express = require("express");
const indexRouter = express.Router();
const markersRouter = require("./markers");

const pool = require("../helpers/connection");
const DBHive = require("../helpers/dbhive");

/* GET home page. */
indexRouter.get("/", function (req, res, next) {
    return res.send("worldmappin api V1");
});

indexRouter.post("/", function (req, res, next) {
    return res.send({ title: "worldmappin-api" });
});

indexRouter.get("/ranking", async function (req, res, next) {
    try {
        const query = `
        SELECT
            ROW_NUMBER() OVER ( ORDER BY COUNT(*) DESC ) AS 'rank',
            username AS author,
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

indexRouter.get("/rankingWinter", async function (req, res, next) {
    try {
        const query = `
        SELECT
            username AS author,
            COUNT(*) * 3 AS tickets
        FROM
            markerinfo
        WHERE
            postDate BETWEEN '2024-12-01' AND '2025-01-01'
            AND isCurated = 1 AND isDigested > 0 AND postQuality > 0
        GROUP BY
            username
        ORDER BY
            COUNT(*) DESC
        `
        const dataWMP = await pool.query(query)
        const dataHiveSQL = await DBHive.getDataChallenge202412()
        const data = [...dataWMP]
        dataHiveSQL.forEach((item) => {
            const itemData = data.find((o) => o.author == item.author)
            if(itemData) {
                itemData.tickets = itemData.tickets + item.tickets  
            } else {
                data.push(item)   
            }
        })

        return res.json(data.sort((a,b) => b.tickets - a.tickets));
    } catch(e) {
        console.error(e)
        return res.status(500).json({msg : "getRankingWinter failed", error: e.message});
    }
})

indexRouter.get("/ranking202508", async function (req, res, next) {
    try {
        const query = `
        SELECT
            username AS author,
            COUNT(*) * 3 AS tickets
        FROM
            markerinfo
        WHERE
            postDate BETWEEN '2025-08-01' AND '2025-09-01'
            AND isCurated = 1 AND isDigested > 0 AND postQuality > 0
        GROUP BY
            username
        ORDER BY
            COUNT(*) DESC
        `
        const dataWMP = await pool.query(query)

        const dataHiveSQL = await DBHive.getDataChallenge202508()
        const data = [...dataWMP]
        dataHiveSQL.forEach((item) => {
            const itemData = data.find((o) => o.author == item.author)
            if(itemData) {
                itemData.tickets = itemData.tickets + item.tickets
            } else {
                data.push(item)
            }
        })

        return res.json(data.sort((a,b) => b.tickets - a.tickets));
    } catch(e) {
        console.error(e)
        return res.status(500).json({msg : "getRanking202508 failed", error: e.message});
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
