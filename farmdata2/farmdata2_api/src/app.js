import express, { request } from 'express'
import pool from './db.js'
import cors from 'cors'

const app = express()

// Home Route
app.get("/", async (req, res) => {
  res.json({
    message: "FarmData2 API server",
  });
});
app.use(cors())
app.use(express.json());

const port = 80;

// Listening Server
app.listen(port, () => {
  console.log(`Server is up at port:${port}`);
});

// use : to specify route parameters
app.get("/user/:userid?", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    if (req.params.userid == null) {
      var sql = `SELECT name, mail FROM users`;
    } else {
      var sql = `SELECT name, mail FROM users WHERE uid = ${req.params.userid}`;
    }
    let result = await conn.query(sql);
    // result = express.json(result);
    res.json({result});
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
