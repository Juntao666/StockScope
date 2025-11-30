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

const getTopRevenueGrowth = async function(req, res) {
  let { k } = req.query;
  if (!k) k = 15;

  const sql = `
    SELECT 
        c.name AS company_name,
        c.code,
        fs_current.year AS current_year,
        fs_current.yearly_financial / 1000000 AS current_revenue_millions,
        fs_prev.yearly_financial / 1000000 AS prev_revenue_millions,
        ROUND(
            ((fs_current.yearly_financial - fs_prev.yearly_financial) / 
             fs_prev.yearly_financial * 100), 2
        ) AS revenue_growth_pct,
        c.full_time_employees
    FROM Company c
    JOIN FinancialStatement fs_current 
        ON c.code = fs_current.company_code
    JOIN FinancialStatement fs_prev 
        ON c.code = fs_prev.company_code 
        AND fs_prev.year = fs_current.year - 1
    WHERE fs_current.year = (SELECT MAX(year) FROM FinancialStatement)
      AND fs_current.yearly_financial > fs_prev.yearly_financial
    ORDER BY revenue_growth_pct DESC
    LIMIT $1;
  `;

  connection.query(sql, [k], (err, result) => {
    if (err) {
      console.error(err);
      res.json({});
    } else {
      res.json(result.rows);
    }
  });
};

module.exports = {
  getTopRevenueGrowth
}
