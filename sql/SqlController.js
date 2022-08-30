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
  editDataLogin(data, index) {
    const sql = `update login set users = "${data.users}" , pass = "${data.password}" where id = ${index}`;
    this.connectionDatabase().query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("Update success");
    });
  }
  // deleteDataLogin(index) {
  //   const sql = `delete from login where id = ${index}`;
  //   this.connectionDatabase().query(sql, (err) => {
  //     if (err) {
  //       throw new Error(err.message);
  //     }
  //     console.log("Update success");
  //   });
  // }
  async createNewInfoStudents(data) {
    await this.insertStudents(data);
    await this.insertLogin(data);
    await this.insertScore(data);
    let idLogin = await this.findMaxId("maxId_login").catch((e) =>
      console.log(e.message)
    );
    let idStudents = await this.findMaxId("maxid_students").catch((e) =>
      console.log(e.message)
    );
    let idScore = await this.findMaxId("maxId_scores").catch((e) =>
      console.log(e.message)
    );
    this.insertClass(
      idStudents[0].id,
      idScore[0].id,
      idLogin[0].id,
      data.class
    );
  }
  insertStudents(data) {
    const sql = `insert into students (name , age , address) values ('${
      data.name
    }' ,${Number(data.age)} , '${data.address}')`;
    this.connectionDatabase().query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("Insert success");
    });
  }
  insertLogin(data) {
    const sql = `insert into login (users , pass , role) values ('${
      data.users
    }' , '${data.pass}' , ${Number(data.role)} )`;
    this.connectionDatabase().query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("Insert success");
    });
  }
  insertScore(data) {
    let avg =
      (Number(data.math) + Number(data.physic) + Number(data.chemistry)) / 3;
    const sql = `insert into scores (math , physic , chemistry , avg)
    values(${Number(data.math)}, ${Number(data.physic)} , ${Number(
      data.chemistry
    )} , ${avg})`;
    this.connectionDatabase().query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("Insert success");
    });
  }
  insertClass(idStudents, idScore, idLogin, nameClass) {
    const sql = `insert into class (idStudents , idScore,idLogin , name)
    values (${idStudents} , ${idScore} , ${idLogin} , '${nameClass}')
    `;
    this.connectionDatabase().query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("Insert success");
    });
  }
  findMaxId(viewName) {
    const sql = `select * from ${viewName}`;
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
