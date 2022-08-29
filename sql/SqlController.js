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
  getDatabase() {
    const mySql = `select * from students`;
    this.connectionDatabase().query(mySql, (err, result) => {
      if (err) {
        throw Error(err.message);
      }
      console.log(result);
    });
  }
}
module.exports = SqlController;
