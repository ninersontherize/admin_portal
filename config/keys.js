const Pool = require('pg').Pool
const { getEnvironment } = require('./environment');
const vars = getEnvironment(['RDS_CREDENTIALS']);
const creds = JSON.parse(vars['RDS_CREDENTIALS']);


// TOM REMOVE ME
(async ()=>{
  const myPool = new Pool({
    user: creds['user_name'],
    host: creds['host'],
    database: creds['database'],
    password: creds['password'],
    port: creds['port']
  });
  console.log('testing_conn')
  const res = await myPool.query(`select u.* from app.user u;;`)
  console.log(res)
})()

const pool = new Pool({
      user: creds['user_name'],
      host: creds['host'],
      database: creds['database'],
      password: creds['password'],
      port: creds['port']
    });


//dev db
//const pool = new Pool({
//  user: 'postgres',
//  host: 'localhost',
//  database: 'casualadmin_dev',
//  password: 'password',
//  port: 54320,
//});


module.exports = {
  pool,
  secretOrKey: "secret"
};