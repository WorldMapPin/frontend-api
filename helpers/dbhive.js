const dotenv = require("dotenv");
const sql = require("mssql")

dotenv.config();

const sqlConfig = {
    "server": process.env.MSSQL_HOST || "vip.hivesql.io",
    "database": process.env.MSSQL_DATABASE || "DBHive",
    "user": process.env.MSSQL_USER,
    "password": process.env.MSSQL_PASSWORD,
    "requestTimeout": 60000,
    "options": {"encrypt": true, "trustServerCertificate": true, "enableArithAbort":true}
}

exports.getDataChallenge202412 = function() {
	return new sql.ConnectionPool(sqlConfig)
	.connect()
	.then(pool => {
	return pool
		.request()
		.query(`
				WITH 
				dataPost AS (
					SELECT
						author,
						CONVERT(DATE,created) AS [date],
						COUNT(*) AS posts
					FROM
						Comments
					WHERE
						depth = 0
						AND author NOT IN ('worldmappin')
						AND created BETWEEN '2024-12-01' AND '2025-01-01'
						AND ISJSON(json_metadata) = 1
						AND (category = 'hive-163772' OR JSON_QUERY(json_metadata,'$.tags') LIKE '%hive-163772%')
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%winterchallenge%'
					GROUP BY
						author,
						CONVERT(DATE,created)
				)
				,dataSnap AS (
					SELECT
						author,
						CONVERT(DATE,created) AS [date],
						COUNT(*) AS [posts]
					FROM
						Comments
					WHERE
						depth > 0
						AND author NOT IN ('worldmappin')
						AND created BETWEEN '2024-12-01' AND '2025-01-01'
						AND category = 'hive-124838'
						AND parent_author = 'peak.snaps'
						AND ISJSON(json_metadata) = 1
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%hive-163772%'
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%winterchallenge%'
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%traveldigest%'
					GROUP BY
						author,
						CONVERT(DATE,created)
				)
				,dataTickets AS (
					SELECT
						author,
						[date],
						(SELECT MIN(v) FROM (VALUES (posts), (1)) AS value(v)) AS [tickets]
					FROM
						dataPost
					UNION SELECT
						author,
						[date],
						(SELECT MIN(v) FROM (VALUES (posts), (1)) AS value(v)) AS [tickets]
					FROM
						dataSnap
				)
				SELECT
					author,
					SUM(tickets) AS [tickets]
				FROM
					dataTickets
				GROUP BY
					author
		`)
	})
	.then(result => {
		sql.close()
		return result.recordsets[0]
	})
	.catch(error => {
		console.log(error)
		sql.close()
	})
}

exports.getDataChallenge202508 = function() {
	return new sql.ConnectionPool(sqlConfig)
	.connect()
	.then(pool => {
	return pool
		.request()
		.query(`
				WITH 
				dataPost AS (
					SELECT
						author,
						CONVERT(DATE,created) AS [date],
						COUNT(*) AS posts
					FROM
						Comments
					WHERE
						depth = 0
						AND author NOT IN ('worldmappin')
						AND created BETWEEN '2025-08-01' AND '2025-09-01'
						AND ISJSON(json_metadata) = 1
						AND (category = 'hive-163772' OR JSON_QUERY(json_metadata,'$.tags') LIKE '%hive-163772%')
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%superchallenge%'
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%favorite%'
					GROUP BY
						author,
						CONVERT(DATE,created)
				)
				,dataSnap AS (
					SELECT
						author,
						CONVERT(DATE,created) AS [date],
						COUNT(*) AS [posts]
					FROM
						Comments
					WHERE
						depth > 0
						AND author NOT IN ('worldmappin')
						AND created BETWEEN '2025-08-01' AND '2025-09-01'
						AND category = 'hive-124838'
						AND parent_author = 'peak.snaps'
						AND ISJSON(json_metadata) = 1
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%hive-163772%'
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%superchallenge%'
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%favorite%'
					GROUP BY
						author,
						CONVERT(DATE,created)
				)
				,dataWave AS (
					SELECT
						author,
						CONVERT(DATE,created) AS [date],
						COUNT(*) AS [posts]
					FROM
						Comments
					WHERE
						depth > 0
						AND author NOT IN ('worldmappin')
						AND created BETWEEN '2025-08-01' AND '2025-09-01'
						AND category = 'hive-125125'
						AND parent_author = 'ecency.waves'
						AND ISJSON(json_metadata) = 1
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%hive-163772%'
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%superchallenge%'
						AND JSON_QUERY(json_metadata,'$.tags') LIKE '%favorite%'
					GROUP BY
						author,
						CONVERT(DATE,created)
				)
				,dataTickets AS (
					SELECT
						author,
						[date],
						(SELECT MIN(v) FROM (VALUES (posts), (1)) AS value(v)) AS [tickets]
					FROM
						dataPost
					UNION SELECT
						author,
						[date],
						(SELECT MIN(v) FROM (VALUES (posts), (1)) AS value(v)) AS [tickets]
					FROM
						dataSnap
					UNION SELECT
						author,
						[date],
						(SELECT MIN(v) FROM (VALUES (posts), (1)) AS value(v)) AS [tickets]
					FROM
						dataWave
				)
				SELECT
					author,
					SUM(tickets) AS [tickets]
				FROM
					dataTickets
				GROUP BY
					author
		`)
	})
	.then(result => {
		sql.close()
		return result.recordsets[0]
	})
	.catch(error => {
		console.log(error)
		sql.close()
	})
}