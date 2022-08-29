const mysql = require("mysql");
class SqlController {
  connectionDatabase() {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123123",
      database: "students_db",
    });

    connection.connect();
    return connection;
  }

  getViewLogin() {
    return new Promise((resolve, reject) => {
      const sql = `select * from managerLogin`;
      this.connectionDatabase().query(sql, (err, result) => {
        if (err) {
          reject(err.message);
        }
        resolve(result);
      });
    });
  }
  getViewStudents() {
    return new Promise((resolve, reject) => {
      const sql = `select * from managerStudents`;
      this.connectionDatabase().query(sql, (err, result) => {
        if (err) {
          reject(err.message);
        }
        resolve(result);
      });
    });
  }
}
module.exports = SqlController;
