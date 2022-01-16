const Pool = require('pg').Pool
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: '2415',
    database: 'reunion'
})
module.exports = pool;