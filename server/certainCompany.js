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

const getStockPrices = async function(req, res) {
  const { code } = req.params;
  let { start, end } = req.query;

  if (!code) {
    res.json({ error: "Missing stock code" });
    return;
  }

  const today = new Date();
  if (!start) start = new Date('2025-01-01').getTime();
  if (!end) end = today.getTime();

  const startDate = new Date(Number(start)).toISOString().slice(0, 10);
  const endDate = new Date(Number(end)).toISOString().slice(0, 10);

  const sql = `
    SELECT 
        date,
        open,
        close,
        high,
        low
    FROM stock
    WHERE code = $1
      AND date BETWEEN $2 AND $3
    ORDER BY date DESC;
  `;

  connection.query(sql, [code, startDate, endDate], (err, result) => {
    if (err) {
      console.error(err);
      res.json({});
    } else {
      res.json(result.rows);
    }
  });
};


const getStockSentiment = async function(req, res) {
  const { code } = req.params;
  let { start, end } = req.query;

  if (!code) {
    res.json({ error: "Missing stock code" });
    return;
  }

  const today = new Date();
  if (!start) start = new Date('2025-01-01').getTime();
  if (!end) end = today.getTime();

  const startDate = new Date(Number(start)).toISOString().slice(0, 10);
  const endDate = new Date(Number(end)).toISOString().slice(0, 10);

  const sql = `
    WITH filtered AS (
        SELECT 
            ncs.sentiment_score
        FROM newscompanysentiment ncs
        JOIN newsdetail nd
            ON ncs.news_id = nd.id
        WHERE ncs.company_code = $1
          AND nd.timestamp BETWEEN $2 AND $3
    )
    SELECT 
        ROUND(AVG(sentiment_score), 4) AS sentiment_score,
        CASE 
            WHEN AVG(sentiment_score) >= 0.35 THEN 'Bullish'
            WHEN AVG(sentiment_score) >= 0.1 THEN 'Somewhat-Bullish'
            WHEN AVG(sentiment_score) > -0.1 THEN 'Neutral'
            WHEN AVG(sentiment_score) > -0.35 THEN 'Somewhat-Bearish'
            ELSE 'Bearish'
        END AS sentiment_level
    FROM filtered;
  `;

  connection.query(sql, [code, startDate, endDate], (err, result) => {
    if (err) {
      console.error(err);
      res.json({});
    } else {
      res.json(result.rows[0]);
    }
  });
};



module.exports = {
  getStockPrices,
  getStockSentiment
}
