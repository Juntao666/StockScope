const { Pool, types } = require('pg');
const config = require('./config.json');

types.setTypeParser(20, val => parseInt(val, 10));

const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: { rejectUnauthorized: false },
});
connection.connect((err) => err && console.log(err));

const getTopRevenueGrowth = async function(req, res) {
  let { k } = req.query;
  if (!k) k = 15;

  const sql = `
    WITH latest_year AS (
        SELECT MAX(year) AS year FROM FinancialStatement
    )
    SELECT
        c.name AS company_name,
        c.code,
        fs_curr.year AS current_year,

        -- Sum Q1-Q4 for current year
        (fs_curr.q1 + fs_curr.q2 + fs_curr.q3 + fs_curr.q4) / 1000000
            AS current_revenue_millions,

        -- Sum Q1-Q4 for previous year
        (fs_prev.q1 + fs_prev.q2 + fs_prev.q3 + fs_prev.q4) / 1000000
            AS prev_revenue_millions,

        ROUND(
            (
                (
                    (fs_curr.q1 + fs_curr.q2 + fs_curr.q3 + fs_curr.q4)
                    -
                    (fs_prev.q1 + fs_prev.q2 + fs_prev.q3 + fs_prev.q4)
                )
                /
                NULLIF(
                    (fs_prev.q1 + fs_prev.q2 + fs_prev.q3 + fs_prev.q4),
                    0
                )
            ) * 100, 2
        ) AS revenue_growth_pct,

        c.full_time_employees
    FROM Company c
    JOIN FinancialStatement fs_curr
        ON c.code = fs_curr.company_code
    JOIN FinancialStatement fs_prev
        ON c.code = fs_prev.company_code 
        AND fs_prev.year = fs_curr.year - 1
    JOIN latest_year ly
        ON fs_curr.year = ly.year
    WHERE (fs_curr.q1 + fs_curr.q2 + fs_curr.q3 + fs_curr.q4) >
          (fs_prev.q1 + fs_prev.q2 + fs_prev.q3 + fs_prev.q4)
    ORDER BY revenue_growth_pct DESC
    LIMIT $1;
  `;

  connection.query(sql, [k], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ error: "Query failed" });
    }
    res.json(result.rows);
  });
};

module.exports = { getTopRevenueGrowth };
