const mysql = require('mysql2/promise');

const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'enterprise_assistant_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

pool.runMigrations = async () => {
  try {
    const migrationPath = path.join(__dirname, 'wealth_schema_migration.sql');
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, 'utf8');
      const connection = await pool.getConnection();
      await connection.query(sql);
      connection.release();
      console.log('MySQL Wealth Schema Migrations Applied Successfully');
    }
  } catch (error) {
    console.error('MySQL Migration Warning:', error.message);
  }
};

module.exports = pool;

