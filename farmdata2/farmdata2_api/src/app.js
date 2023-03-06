import express, { request } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import swaggerDefinition from './swagger.json' assert { type: 'json' }
import pool from './db.js'
import cors from 'cors'
const app = express()

// Specify the swagger specification using ./swagger.json imported
const swaggerSpecification = {
  swaggerDefinition,
  apis: ['/app/src/*.js'],
}

// Write the Swagger JSON file to disk
const swaggerSpec = swaggerJSDoc(swaggerSpecification);

// Documentation using swagger and OpenAPI Specification
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {explorer: true}))


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
 * @swagger
 * "/crops/mapByName":
 *   get:
 *     summary: Returns a mapping of crop names to their corresponding tid.
 *     description: Returns an object of crops and their tid. 
 *     responses:
 *       "200":
 *         description: A JSON object of crops and their tid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: name of the crop found in taxonomy_term_data
 *                   example: BROCCOLI
 *                 tid:
 *                   type: string
 *                   description: The tid of the crop found in taxonomy_term_data
 *                   example: 13
 */
app.get("/crops/mapByName", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();   
    var sql = `
    SELECT JSON_OBJECTAGG(name, tid) AS data
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
 * @swagger
 * "/crops/mapById":
 *   get:
 *     summary: Returns a mapping of crop tid to crop name.
 *     description: Returns an object of crop tid to crop name. 
 *     responses:
 *       "200":
 *         description: A JSON object of crops and their tid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tid:
 *                   type: string
 *                   description: The tid of the crop found in taxonomy_term_data
 *                   example: 13
 *                 name:
 *                   type: string
 *                   description: name of the crop found in taxonomy_term_data
 *                   example: BROCCOLI
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
 * @swagger
 * "/areas/mapByName":
 *   get:
 *     summary: Returns a mapping of area names to their corresponding tid.
 *     description: Returns an object of areas and their tid. 
 *     responses:
 *       "200":
 *         description: A JSON object of areas and their tid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: name of the crop found in taxonomy_term_data
 *                   example: A
 *                 tid:
 *                   type: string
 *                   description: The tid of the crop found in taxonomy_term_data
 *                   example: 13
 */
app.get("/areas/mapByName", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var sql = `
    SELECT JSON_OBJECTAGG(name, tid) AS data
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
 * @swagger
 * "/areas/mapById":
 *   get:
 *     summary: Returns a mapping of area tid to area name.
 *     description: Returns an object of area tid to area name. 
 *     responses:
 *       "200":
 *         description: A JSON object of areas and their tid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tid:
 *                   type: string
 *                   description: The tid of the area found in taxonomy_term_data
 *                   example: 13
 *                 name:
 *                   type: string
 *                   description: name of the area found in taxonomy_term_data
 *                   example: A
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
app.get("/users/:userid?", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    if (req.params.userid == null) {
      var sql = `SELECT name, mail FROM users`;
    } else {
      var sql = `SELECT name, mail FROM users WHERE uid = ${req.params.userid}`;
    }
    let data = await conn.query(sql);
    // result = express.json(result);
    res.json({data});
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

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
