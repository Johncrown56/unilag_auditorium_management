const connection = require("../config/db");
const executeQuery = async (sql, params) => {
  try {
    const [rows, fields] = await connection.execute(sql, params);
    return rows;
  } finally {
    //connection.release(); // Release the connection back to the pool
  }
};

module.exports = {
  executeQuery,
};
