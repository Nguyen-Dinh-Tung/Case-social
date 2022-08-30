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
    const sql = `select * from managerLogin`;
    return new Promise((resolve, reject) => {
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
  findData(data) {
    const sql = `select * from managerLogin where managerLogin.users = '${data.users}' and managerLogin.pass = '${data.pass}'`;
    return new Promise((resolve, reject) => {
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
