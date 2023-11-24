const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "J0h#@ade",
  database: "auditorium_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//pool.getConnection( function(err, connection){
pool
  .getConnection()
  .then((connection) => {
    console.log(`MYSQL2 is connected successfully `.cyan.underline);
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error(`Error connecting to MySQL:`.cyan.underline, err.message);
    process.exit(1); // Exit the application if there's an error connecting
  });

module.exports = pool;
