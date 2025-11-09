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

const random = async function(req, res) {

  connection.query(`
    SELECT *
    FROM Stock
    WHERE date = (SELECT MAX(date) FROM Stock)
    ORDER BY RANDOM()
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

module.exports = {
  random
}
