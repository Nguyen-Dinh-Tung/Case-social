const mysql = require("mysql");
class SqlController {
  connectionDatabase() {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123123",
      database: "db_students",
    });

    connection.connect();
    return connection;
  }

  getLoginUser() {
    return new Promise((resolve, reject) => {
      const sql = `select * from view_login_students`;
      this.connectionDatabase().query(sql, (err, result) => {
        if (err) {
          reject(err.message);
        }
        resolve(result);
      });
    });
  }
  getLoginAdmin() {
    return new Promise((resolve, reject) => {
      const sql = `select * from view_login_admin`;
      this.connectionDatabase().query(sql, (err, result) => {
        if (err) {
          reject(err.message);
        }
        resolve(result);
      });
    });
  }
  getDbViewStudent() {
    return new Promise((resolve, reject) => {
      const sql = `select * from info_students`;
      this.connectionDatabase().query(sql, (err, result) => {
        if (err) {
          reject(err.message);
        }
        resolve(result);
      });
    });
  }
  getDbViewScores(id) {
    return new Promise((resolve, reject) => {
      const sql = `select * from view_students_score where id_students = ${id}`;
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
