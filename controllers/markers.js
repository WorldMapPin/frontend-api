// require("dotenv").config();
const pool = require("../helpers/connection");
const { sanitizeVal } = require("../helpers/utils");

module.exports = {
    getMarkers: async (req, res, next) => {
        try {
            let page = parseInt(req.params.page);
            let limit = parseInt(req.params.limit);
            const author = req.body.author ? sanitizeVal(req.body.author) : null;
            const tags = req.body.tags && req.body.tags.length ? req.body.tags : []; //.map(function (a) { return '"' + a.replace('"', '""') + '"'; }).join(',') : [];
            const startDate = req.body.start_date ? req.body.start_date.split('T')[0] : null;
            const endDate = req.body.end_date ? req.body.end_date.split('T')[0] : null;
            const curatedOnly = req.body.curated_only ? 1 : 0;
            const permlink = req.body.permlink ? req.body.permlink : null;
            const postTitle = req.body.post_title ? req.body.post_title : null;
            let queryParams = [];
            let whereParamsCount = 0;
            let query = " SELECT id, longitude, lattitude FROM markerinfo WHERE lattitude != 0 AND longitude != 0";
            if (author || tags.length || startDate || endDate || curatedOnly || permlink || postTitle) {
                query += ' AND ';
                if (author) {
                    query += ' username = ? ';
                    queryParams.push(author);
                    whereParamsCount += 1;
                }
                if (tags.length) {
                    query += whereParamsCount > 0 ? ' AND ' : '';
                    for(var t=0;t<tags.length;t++) {
                        query += t > 0 ? ' AND FIND_IN_SET(?, tags) > 0 ' : 'FIND_IN_SET(?, tags) > 0 ';
                        queryParams.push(tags[t]);
                        whereParamsCount += 1;
                    }
                }
                if (startDate) {
                    query += whereParamsCount > 0 ? ' AND DATE(postDate) >= STR_TO_DATE( ? , "%Y-%m-%d")' : ' DATE(postDate) >= STR_TO_DATE( ? , "%Y-%m-%d")';
                    queryParams.push(startDate);
                    whereParamsCount += 1;
                }
                if (endDate) {
                    query += whereParamsCount > 0 ? ' AND DATE(postDate) <= STR_TO_DATE( ? , "%Y-%m-%d")' : ' DATE(postDate) <= STR_TO_DATE( ? , "%Y-%m-%d")';
                    queryParams.push(endDate);
                    whereParamsCount += 1;
                }
                if (curatedOnly) {
                    query += whereParamsCount > 0 ? ' AND editorsChoice = ? ' : ' editorsChoice = ? ';
                    queryParams.push(1);
                    whereParamsCount += 1;
                }
                if (permlink) {
                    query += whereParamsCount > 0 ? ' AND postPermLink = ?' : ' postPermLink = ?';
                    queryParams.push(permlink);
                    whereParamsCount += 1;
                }
                if (postTitle) {
                    query += whereParamsCount > 0 ? ' AND postTitle = ?' : ' postTitle = ?';
                    queryParams.push(postTitle);
                    whereParamsCount += 1;
                }
            }
            query += ` ORDER BY postValue DESC`;
            if (req.params.limit) {
                query += ` LIMIT ?, ?;`;
                queryParams.push(page);
                queryParams.push(limit);
            }
            // console.log(query);
            // console.log(queryParams);
            const rows = await pool.query(query, queryParams)
            return res.json(rows);
        } catch(e) {
            console.error(e)
            return res.status(500).json({msg : "getMarkers failed", error: e.message});
        }
    },
    getMarkersFromPostLink: async (req, res, next) => {
        try {
            const postLink = req.body.post_link ? sanitizeVal(req.body.post_link) : null;
            const query = "SELECT postDate, postLink, postImageLink, postTitle, postDescription, username, postUpvote, postValue FROM markerinfo WHERE postLink = ?";
            const rows = await pool.query(query, [postLink])
            return res.json(rows);
        } catch(e) {
            console.error(e)
            return res.status(500).json({msg : "getMarkersFromPostLink failed", error: e.message});
        }
    },
    getMarkersFromMarkerIds: async (req, res, next) => {
        try {
            const marker_ids = req.body.marker_ids && req.body.marker_ids.length ? (req.body.marker_ids.map(function (a) { return pool.escape(`${a}`) }).join()) : '';
            if(marker_ids.length){
                let queryString = "SELECT postDate, postLink, postImageLink, postTitle, postDescription, username, postUpvote, postValue FROM markerinfo WHERE id IN ("+marker_ids+")";
                // console.log(queryString);
                const rows = await pool.query(queryString, [])
                return res.json(rows);
            } else {
                return res.json([]);
            }
        } catch(e) {
            console.error(e)
            return res.status(500).json({msg : "getMarkersFromMarkerIds failed", error: e.message});
        }
    },
};