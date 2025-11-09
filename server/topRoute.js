const { Pool, types } = require('pg');
const config = require('./config.json')

types.setTypeParser(20, val => parseInt(val, 10));
const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

const gain = async function(req, res) {

  connection.query(`
WITH latest_date AS (
    SELECT MAX(date) AS max_date FROM Stock
),
price_change AS (
    SELECT 
        s.code,
        s.close,
        ((s.close - LAG(s.close) OVER (PARTITION BY s.code ORDER BY s.date)) 
         / LAG(s.close) OVER (PARTITION BY s.code ORDER BY s.date) * 100) AS percentage,
        s.date
    FROM Stock s
)
SELECT 
    p.code,
    ROUND(p.percentage, 2) AS percentage,
    p.close,
    c.name AS company
FROM price_change p
JOIN latest_date ld ON p.date = ld.max_date
LEFT JOIN Company c ON p.code = c.code
WHERE p.percentage IS NOT NULL
ORDER BY p.percentage DESC
LIMIT 10;

  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

const decline = async function(req, res) {

  connection.query(`
WITH latest_date AS (
    SELECT MAX(date) AS max_date FROM Stock
),
price_change AS (
    SELECT 
        s.code,
        s.close,
        ((s.close - LAG(s.close) OVER (PARTITION BY s.code ORDER BY s.date)) 
         / LAG(s.close) OVER (PARTITION BY s.code ORDER BY s.date) * 100) AS percentage,
        s.date
    FROM Stock s
)
SELECT 
    p.code,
    ROUND(p.percentage, 2) AS percentage,
    p.close,
    c.name AS company
FROM price_change p
JOIN latest_date ld ON p.date = ld.max_date
LEFT JOIN Company c ON p.code = c.code 
WHERE p.percentage IS NOT NULL
ORDER BY p.percentage ASC
LIMIT 10;

  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}


const intervalCloseK = async function(req, res) {
  let { start, end, k } = req.query;

  const today = new Date();
  if (!start) start = new Date('2025-01-01').getTime();
  if (!end) end = today.getTime();
  if (!k) k = 10;
  const startDate = new Date(Number(start)).toISOString().slice(0, 10);
  const endDate = new Date(Number(end)).toISOString().slice(0, 10);

  const sql = `
    SELECT 
        code,
        ROUND(AVG(close), 2) AS avg_close
    FROM Stock
    WHERE date BETWEEN $1 AND $2
    GROUP BY code
    ORDER BY avg_close DESC
    LIMIT $3;
  `;

  connection.query(sql, [startDate, endDate, k], (err, result) => {
    if (err) {
      console.error(err);
      res.json({});
    } else {
      res.json(result.rows);
    }
  });
}


module.exports = {
  gain,
  decline,
  intervalCloseK
}
