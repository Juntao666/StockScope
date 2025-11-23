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

const getBearishNewsAnd3DayImpact = async function(req, res) {

  const sql = `
    SELECT
        c.name AS company_name,
        nd.title AS news_title,
        nd.timestamp AS news_date,
        ncs.sentiment_score,
        s1.close AS price_at_news,
        s2.close AS price_3days_later,
        ROUND(((s2.close - s1.close) / s1.close * 100), 2) AS price_change_pct
    FROM NewsDetail nd
    JOIN NewsCompanySentiment ncs ON nd.id = ncs.news_id
    JOIN Company c ON ncs.company_code = c.code
    JOIN Stock s1 ON c.code = s1.code
        AND s1.date = DATE(nd.timestamp)
    LEFT JOIN Stock s2 ON c.code = s2.code
        AND s2.date = DATE(nd.timestamp) + INTERVAL '3 days'
    WHERE nd.timestamp > CURRENT_TIMESTAMP - INTERVAL '30 days'
      AND ncs.sentiment_score < -0.3
      AND s2.close IS NOT NULL
    ORDER BY ncs.sentiment_score ASC, nd.timestamp DESC, price_change_pct
    LIMIT 20;
  `;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.json({});
    } else {
      res.json(result.rows);
    }
  });
};

module.exports = {
  getBearishNewsAnd3DayImpact
}

