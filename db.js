const Pool = require('pg').Pool;

let pool;

if (process.env.DB_URL) {
    pool = new Pool({
        connectionString: process.env.DB_URL,
    ssl: {
      rejectUnauthorized: false
    }
    })
} else {
    pool = new Pool({
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DB_USERDATABASE_HOST,
        port: 5432,
        database: process.env.DATABASE,
        ssl: {
            rejectUnauthorized: false
        }
    });
}


module.exports = pool;

