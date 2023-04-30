import express, { request } from 'express'
import swaggerDefinition from './swaggerspec.json' assert { type: 'json' }
import expressJSDocSwagger from 'express-jsdoc-swagger'
import pool from './db.js'
import cors from 'cors'
import { fileURLToPath } from 'url';
import path from 'path';

// Specification configuration. This is needed for ES6 compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
swaggerDefinition.baseDir = __dirname

const app = express()
expressJSDocSwagger(app)(swaggerDefinition)

// Default API server
app.get("/", async (req, res) => {
  res.json({
    message: "FarmData2 API server",
  });
});

// Enable cors for communcation between containers
app.use(cors())
app.use(express.json());

const port = 80;

// Listening Server
app.listen(port, () => {
  console.log(`Server is up at port:${port}`);
});

/**
 * GET /crops/mapByName
 * @summary Returns a mapping of crop names to their corresponding tid.
 * @tags Maps
 * @return {object} 200 - Returns a mapping of crop names to their corresponding tid.
 * @example response - 200 - success response
 * {
 *    "DANDILION": "41",
 *    "GRASS": "42",
 *    "WHEATGRASS": "43",
 *    "BROCCOLI": "45",
 *    "BROCCOLI RABE": "46"
 * }
 */
app.get("/crops/mapByName", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();   
    var sql = `
    SELECT JSON_OBJECTAGG(name, CAST(tid AS CHAR)) AS data
    FROM (
      SELECT tid, t1.name
      FROM taxonomy_term_data AS t1
      JOIN taxonomy_vocabulary AS t2
      ON t1.vid = t2.vid
      WHERE t2.machine_name = "farm_crops"
    ) t
    `;
    const results = await conn.execute(sql);
    res.json(results[0].data);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

/**
 * GET /crops/mapById
 * @summary Returns a mapping of crop tid to their corresponding crop names.
 * @tags Maps
 * @return {object} 200 - Returns a mapping of crop tid to their corresponding crop names.
 * @example response - 200 - success response
 * {
 *    "41": "DANDILION",
 *    "42": "GRASS",
 *    "43": "WHEATGRASS",
 *    "45": "BROCCOLI",
 *    "46": "BROCCOLI RABE"
 * }
 */
app.get("/crops/mapById", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var sql = `
    SELECT JSON_OBJECTAGG(tid, name) AS data
    FROM (
      SELECT tid, t1.name
      FROM taxonomy_term_data AS t1
      JOIN taxonomy_vocabulary AS t2
      ON t1.vid = t2.vid
      WHERE t2.machine_name = "farm_crops"
    ) t`
    const results = await conn.execute(sql);
    res.json(results[0].data);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

/**
 * GET /areas/mapByName
 * @summary Returns a mapping of area names to their corresponding tid.
 * @tags Maps
 * @return {object} 200 - Returns a mapping of area names to their corresponding tid.
 * @example response - 200 - success response
 * {
 *    "A": "170",
 *    "ALF": "171",
 *    "ALF-1": "172",
 *    "ALF-2": "173",
 *    "ALF-3": "174"
 * }
 */
app.get("/areas/mapByName", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var sql = `
    SELECT JSON_OBJECTAGG(name, CAST(tid AS CHAR)) AS data
    FROM (
      SELECT tid, t1.name
      FROM taxonomy_term_data AS t1
      JOIN taxonomy_vocabulary AS t2
      ON t1.vid = t2.vid
      WHERE t2.machine_name = "farm_areas"
    ) t`
    const results = await conn.execute(sql);
    res.json(results[0].data);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

/**
 * GET /areas/mapById
 * @summary Returns a mapping of area tid to their corresponding area names.
 * @tags Maps
 * @return {object} 200 - Returns a mapping of area tid to their corresponding area names.
 * @example response - 200 - success response
 * {
 *    "170": "A",
 *    "171": "ALF",
 *    "172": "ALF-1",
 *    "173": "ALF-2",
 *    "174": "ALF-3"
 * }
 */
app.get("/areas/mapById", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var sql = `
    SELECT JSON_OBJECTAGG(tid, name) AS data
    FROM (
      SELECT tid, t1.name
      FROM taxonomy_term_data AS t1
      JOIN taxonomy_vocabulary AS t2
      ON t1.vid = t2.vid
      WHERE t2.machine_name = "farm_areas"
    ) t`
    const results = await conn.execute(sql);
    res.json(results[0].data);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

/**
 * GET /users/mapByName
 * @summary Returns a mapping of usernames to their corresponding uid.
 * @tags Maps
 * @return {object} 200 - Returns a mapping of usernames to their corresponding uid.
 * @example response - 200 - success response
 * {
 *    "admin": "1",
 *    "guest": "10",
 *    "manager1": "3",
 *    "manager2": "4",
 *    "restws1": "11"
 * }
 */
app.get("/users/mapByName", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var sql = `
    SELECT JSON_OBJECTAGG(name, CAST(uid AS CHAR)) AS data
    FROM (
      SELECT uid, name
      FROM users
      WHERE name != ""
    ) t
    `
    const results = await conn.execute(sql);
    res.json(results[0].data);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

/**
 * GET /users/mapById
 * @summary Returns a mapping of uid to their corresponding usernames.
 * @tags Maps
 * @return {object} 200 - Returns a mapping of uid to their corresponding usernames.
 * @example response - 200 - success response
 * {
 *    "1": "admin",
 *    "10": "guest",
 *    "3": "manager1",
 *    "4": "manager2",
 *    "11": "restws1"
 * }
 */
app.get("/users/mapById", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    
    var sql = `
    SELECT JSON_OBJECTAGG(uid, name) AS data
    FROM (
      SELECT uid, name
      FROM users
      WHERE name != ""
    ) t
    `
    const results = await conn.execute(sql);
    res.json(results[0].data);
  } catch (error) { 
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

// APIs below are for testing purposes
/**
 * @swagger
 * "/users":
 *   get:
 *     summary: Returns a list of Farmdata2 users
 *     description: Returns a list of Farmdata2 users from Farmdata2 Database.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           description: the userid
 *     responses:
 *       "200":
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: The username
 *                           example: admin
 *                         mail:
 *                           type: string
 *                           description: The email address of the user
 *                           example: admin@example.com
 */
// app.get("/users/:userid?", async (req, res) => {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     if (req.params.userid == null) {
//       var sql = `SELECT name, mail FROM users`;
//     } else {
//       var sql = `SELECT name, mail FROM users WHERE uid = ${req.params.userid}`;
//     }
//     let data = await conn.query(sql);
//     // result = express.json(result);
//     res.json({data});
//   } catch (error) {
//     throw error;
//   } finally {
//     if (conn) {
//       conn.release();
//     }
//   }
// });

// test paging http://localhost:8000/paging/?page=1&limit=5
app.get("/paging", async (req, res) => {
  let conn;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = {};
  try {
    conn = await pool.getConnection();
    var sql = 'SELECT * FROM field_data_field_farm_asset'
    let obj = await conn.query(sql);
    // result = express.json(result);
    
    // result = JSON.parse(result)
    if (endIndex < obj.length ) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    result.results = obj.slice(startIndex, endIndex);
    res.json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

// Getting logs with timestamp and return paginated results
// use : to specify route parameters
app.get("/log/:type/:start_time-:end_time", async (req, res) => {
  let conn;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = {};
  const logType = req.params.type;
  const startTime = req.params.start_time;
  const endTime = req.params.end_time;
  try {
    conn = await pool.getConnection();
    var sql = 'SELECT * FROM log WHERE (type = \'' + logType + '\') AND (timestamp BETWEEN ' + startTime + ' AND '+ endTime+')';
    let obj = await conn.query(sql);
    result.self = "/log/"+logType+"/"+startTime+"-"+endTime+"/?page="+page+"&limit="+limit;
    const totalPages = Math.ceil(obj.length / limit)
    if (startIndex > 0) {
      result.first = "/log/"+logType+"/"+startTime+"-"+endTime+"/?page="+(page+1)+"&limit="+limit;
    }
    if (endIndex < obj.length ) {
      var nextpage = page + 1;
      result.last = "/log/"+logType+"/"+startTime+"-"+endTime+"/?page="+totalPages+"&limit="+limit;
      result.next = "/log/"+logType+"/"+startTime+"-"+endTime+"/?page="+nextpage+"&limit="+limit;
    }
    result.results = obj.slice(startIndex, endIndex);
    res.json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
});
