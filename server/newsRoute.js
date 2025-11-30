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

const getSentimentTrend = async function(req, res) {

  const sql = `
    SELECT 
        c.name AS company_name,
        c.code,
        COUNT(CASE 
            WHEN nd.timestamp > CURRENT_TIMESTAMP - INTERVAL '30 days'
            THEN 1 
        END) AS news_count_30d,
        ROUND(AVG(CASE 
            WHEN nd.timestamp > CURRENT_TIMESTAMP - INTERVAL '30 days'
            THEN ncs.sentiment_score 
        END), 4) AS avg_sentiment_30d,
        ROUND(AVG(CASE 
            WHEN nd.timestamp > CURRENT_TIMESTAMP - INTERVAL '90 days'
            THEN ncs.sentiment_score 
        END), 4) AS avg_sentiment_90d,
        ROUND(
            AVG(CASE WHEN nd.timestamp > CURRENT_TIMESTAMP - INTERVAL '30 days'
                THEN ncs.sentiment_score END) -
            AVG(CASE WHEN nd.timestamp > CURRENT_TIMESTAMP - INTERVAL '90 days'
                THEN ncs.sentiment_score END),
            4
        ) AS sentiment_change
    FROM Company c
    JOIN NewsCompanySentiment ncs ON c.code = ncs.company_code
    JOIN NewsDetail nd ON ncs.news_id = nd.id
    WHERE nd.timestamp > CURRENT_TIMESTAMP - INTERVAL '90 days'
    GROUP BY c.name, c.code
    HAVING COUNT(CASE 
        WHEN nd.timestamp > CURRENT_TIMESTAMP - INTERVAL '30 days'
        THEN 1 
    END) >= 3
    ORDER BY sentiment_change DESC
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

const getMajorNewsVolumeSpikes = async function(req, res) {

  const sql = `
    WITH MajorNewsEvents AS (
        SELECT
            nd.id AS news_id,
            nd.title,
            nd.timestamp AS news_time,
            COUNT(DISTINCT ncs.company_code) AS affected_companies,
            AVG(ABS(ncs.sentiment_score)) AS avg_sentiment_intensity
        FROM NewsDetail nd
        JOIN NewsCompanySentiment ncs ON nd.id = ncs.news_id
        GROUP BY nd.id, nd.title, nd.timestamp
        HAVING AVG(ABS(ncs.sentiment_score)) > 0.6
            OR COUNT(DISTINCT ncs.company_code) > 3
    ),
    StockVolumeAnomaly AS (
        SELECT
            s.code,
            s.date,
            s.volume,
            s.close,
            AVG(s.volume) OVER (
                PARTITION BY s.code
                ORDER BY s.date
                ROWS BETWEEN 30 PRECEDING AND 1 PRECEDING
            ) AS avg_volume_30d,
            s.volume / NULLIF(
                AVG(s.volume) OVER (
                    PARTITION BY s.code
                    ORDER BY s.date
                    ROWS BETWEEN 30 PRECEDING AND 1 PRECEDING
                ), 0
            ) AS volume_ratio
        FROM Stock s
    )
    SELECT
        c.name AS company_name,
        mne.title AS news_title,
        mne.news_time,
        DATE(mne.news_time) AS news_date,
        ncs.sentiment_score,
        sva.date AS trading_date,
        sva.volume AS trading_volume,
        ROUND(sva.avg_volume_30d, 0) AS avg_volume_30d,
        ROUND(sva.volume_ratio, 2) AS volume_spike_ratio,
        sva.close AS stock_price,
        sva.date - DATE(mne.news_time) AS days_from_news
    FROM MajorNewsEvents mne
    JOIN NewsCompanySentiment ncs ON mne.news_id = ncs.news_id
    JOIN Company c ON ncs.company_code = c.code
    JOIN StockVolumeAnomaly sva ON c.code = sva.code
    WHERE sva.date BETWEEN DATE(mne.news_time) - INTERVAL '2 days'
                       AND DATE(mne.news_time) + INTERVAL '5 days'
      AND sva.volume_ratio > 2.0
    ORDER BY mne.news_time DESC, sva.volume_ratio DESC
    LIMIT 50;
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

const getNegativeNewsWithPriceDrop = async function(req, res) {

  const sql = `
    WITH NewsWithNegativeSentiment AS (
        SELECT 
            ncs.company_code,
            ncs.news_id,
            nd.title,
            nd.timestamp AS news_date,
            ncs.sentiment_score
        FROM NewsCompanySentiment ncs
        JOIN NewsDetail nd ON ncs.news_id = nd.id
        WHERE ncs.sentiment_score < -0.3
    ),
    StockPriceChange AS (
        SELECT 
            s1.code,
            s1.date AS start_date,
            s1.close AS start_price,
            s2.close AS end_price,
            ROUND(((s2.close - s1.close) / s1.close * 100), 2) AS price_change_pct
        FROM Stock s1
        JOIN Stock s2 ON s1.code = s2.code 
            AND s2.date BETWEEN s1.date AND s1.date + INTERVAL '3 days'
        WHERE s2.date = (
            SELECT MAX(date) 
            FROM Stock 
            WHERE code = s1.code 
              AND date BETWEEN s1.date AND s1.date + INTERVAL '3 days'
        )
    )
    SELECT 
        c.name AS company_name,
        c.code AS company_code,
        nws.title AS news_title,
        nws.sentiment_score,
        DATE(nws.news_date) AS news_publish_date,
        spc.start_price,
        spc.end_price,
        spc.price_change_pct AS three_day_return,
        c.full_time_employees
    FROM NewsWithNegativeSentiment nws
    JOIN Company c ON nws.company_code = c.code
    JOIN StockPriceChange spc ON c.code = spc.code 
        AND DATE(nws.news_date) = spc.start_date
    WHERE spc.price_change_pct < -5 
    ORDER BY spc.price_change_pct ASC, nws.sentiment_score ASC
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

const getCompanyFinancials = async function(req, res) {
  const { code } = req.params;
  let { year } = req.query;

  if (!code) {
    res.json({ error: "Missing company code" });
    return;
  }

  
  if (!year) year = 2025;

  const sql = `
    SELECT *
    FROM FinancialStatement f
    JOIN Company c ON f.company_code = c.code
    WHERE f.company_code = $1
      AND f.year = $2;
  `;

  connection.query(sql, [code, year], (err, result) => {
    if (err) {
      console.error(err);
      res.json({});
    } else {
      res.json(result.rows);
    }
  });
};





module.exports = {
  getBearishNewsAnd3DayImpact,
  getSentimentTrend,
  getMajorNewsVolumeSpikes,
  getNegativeNewsWithPriceDrop,
  getCompanyFinancials
}

