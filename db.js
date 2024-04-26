const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DB_USERDATABASE_HOST,
    port: 5432,
    database: process.env.DATABASE
});

module.exports = pool;

