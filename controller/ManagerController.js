const fs = require("fs");
const qs = require("qs");
const SqlController = require("../sql/SqlController");
const cookie = require("cookie");

const mySql = new SqlController();
class ManagerController {
  getTemplate(req, res, path) {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        throw Error(err.message);
      }
      res.writeHead(200, {"content-type": "text/html"});
      res.write(data);
      res.end();
    });
  }
  getTemplateLogin(req, res, path, dataHtml) {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        throw Error(err.message);
      }
      data = data.replace("{change}", dataHtml);
      res.writeHead(200, {"content-type": "text/html"});
      res.write(data);
      res.end();
    });
  }
  // async loginByCookie(req, res, path) {
  //   let cookies = cookie.parse(req.headers.cookie);
  //   let cookieUser = JSON.parse(cookies.user);
  //   console.log(dataSql);
  //   let dataSql = await mySql.findData(cookieUser);
  //   console.log(dataSql);
  //   if (dataSql > 0) {
  //     dataSql.forEach((element) => {
  //       if (element.role == 1) {
  //         this.viewAdmin(req, res, path);
  //       } else {
  //         this.viewUsers(req, res, path, element.id);
  //       }
  //     });
  //   }
  // }
  getDataReq(req, res) {
    return new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        let dataHtml = qs.parse(data);
        resolve(dataHtml);
      });
    });
  }
  async login(req, res, pathUser, pathAdmin) {
    let dataForm = await this.getDataReq(req, res);
    let dataSql = await mySql.findData(dataForm);
    if (dataSql.length > 0) {
      dataSql.forEach((element) => {
        if (element.role == 1) {
          const setCookie = cookie.serialize("user", JSON.stringify(dataForm));
          res.setHeader("Set-cookie", setCookie);
          this.viewAdmin(req, res, pathAdmin);
        } else {
          const setCookie = cookie.serialize("user", JSON.stringify(dataForm));
          res.setHeader("Set-cookie", setCookie);
          this.viewUsers(req, res, pathUser, element.id);
        }
      });
    } else {
      this.locationView(req, res, "/");
    }
  }
  async viewAdmin(req, res, pathAdmin) {
    let html = "";
    let viewMangerStudents = await mySql.getViewStudents();
    viewMangerStudents.forEach((element) => {
      let classicfy = "";
      if (element.avg <= 5) {
        classicfy = "Kém";
      } else if (element.avg >= 5 && element.avg <= 7) {
        classicfy = "Khá";
      } else {
        classicfy = "Giỏi";
      }
      html += `
            <tr>
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.age}</td>
            <td>${element.address}</td>
            <td>${classicfy}</td>
            <td><a href="/details?${element.id}"><button class="btn-fromManager" type="submit">Xem chi tiết</button></a></td>
            <td><a href="/delete?${element.id}"><button class="btn-fromManager" type="submit">Xóa</button></a></td>
            <td><a href="/edit-details?${element.id}"><button class="btn-fromManager" type="submit">Sửa</button></a></td>
            </tr>
            `;
    });
    this.getTemplateLogin(req, res, pathAdmin, html);
  }
  async viewUsers(req, res, pathUsers, id) {
    let html = "";
    let viewMangerStudents = await mySql.getViewStudents();
    viewMangerStudents.forEach((element) => {
      if (element.id == id) {
        let classicfy = "";
        let scoreAvg = Math.floor(element.avg);
        if (scoreAvg <= 5) {
          classicfy = "Kém";
        } else if (scoreAvg >= 5 && scoreAvg <= 7) {
          classicfy = "Khá";
        } else {
          classicfy = "Giỏi";
        }
        html += `
        <tr>
        <td>${element.name}</td>
        <td>${element.math}</td>
        <td>${element.physic}</td>
        <td>${element.chemistry}</td>
        <td>${element.avg}</td>
        <td>${classicfy}</td>
        </tr>
        `;
        this.getTemplateLogin(req, res, pathUsers, html);
      }
    });
  }
  async viewUsersManager(req, res, pathUsers, id) {
    let html = "";
    let viewMangerStudents = await mySql.getViewStudents();
    viewMangerStudents.forEach((element) => {
      if (element.id == id) {
        let classicfy = "";
        let scoreAvg = Math.floor(element.avg);
        if (scoreAvg <= 5) {
          classicfy = "Kém";
        } else if (scoreAvg >= 5 && scoreAvg <= 7) {
          classicfy = "Khá";
        } else {
          classicfy = "Giỏi";
        }
        html += `
        <tr>
        <td>${element.name}</td>
        <td>${element.math}</td>
        <td>${element.physic}</td>
        <td>${element.chemistry}</td>
        <td>${element.avg}</td>
        <td>${classicfy}</td>
        <td><a href="/edit-details-scores?${element.id}"><button class="btn-fromManager" type="submit">Sửa</button></a></td>
        </tr>
        `;
        this.getTemplateLogin(req, res, pathUsers, html);
      }
    });
  }
  locationView(req, res, path) {
    res.writeHead(301, {location: path});
    res.end();
  }
  async showViewUserLogin(req, res, path) {
    let html = "";
    let viewMangerStudents = await mySql.getViewLogin();
    viewMangerStudents.forEach((element) => {
      html += `
            <tr>
            <td>${element.id}</td>
            <td>${element.users}</td>
            <td>${element.pass}</td>
            <td><a href="/details?${element.id}" ><button class="btn-fromManager" type="submit">Xem chi tiết</button></a></td>
            <td><a href="/edit?${element.id}"><button class="btn-fromManager" type="submit">Sửa</button></a></td>
            </tr>
            `;
    });
    this.getTemplateLogin(req, res, path, html);
  }
  async viewEditUsers(req, res, path, index) {
    let htmls = "";
    let viewMangerStudents = await mySql.getViewLogin();
    viewMangerStudents.forEach((element) => {
      htmls += `
            <tr>
            <td>${element.id}</td>
            <td>${element.users}</td>
            <td>${element.pass}</td>
            <td><a href="/details?${element.id}" ><button class="btn-fromManager" type="submit">Xem chi tiết</button></a></td>
            <td><a href="/edit?${element.id}"><button class="btn-fromManager" type="submit">Sửa</button></a></td>
            </tr>
            `;
    });
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        throw Error(err.message);
      }
      let html = "";
      html += `
      <form method="post">
      <input
        type="text"
        name="users"
        id="users"
        value="${viewMangerStudents[index].users}"
        placeholder="Tên đăng nhập"
        required
      />
      <input
        type="password"
        name="password"
        id="password"
        value="${viewMangerStudents[index].pass}"
        placeholder="Mật khẩu"
        required
      />
      <button>Sửa</button>
    </form>`;
      data = data.replace("{change}", htmls);
      data = data.replace("Click vào tài khoản cần thay đổi", html);
      res.write(data);
      res.end();
    });
  }
  async editUsers(req, res, index) {
    let dataForm = await this.getDataReq(req, res);
    mySql.editDataLogin(dataForm, index);
    res.writeHead(301, {location: "/controller"});
    res.end();
  }
  showFormCreate(req, res, path) {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      res.writeHead(200, {"content-type": "text/html"});
      res.write(data);
      res.end();
    });
  }
  async createUsers(req, res) {
    let dataForm = await this.getDataReq(req, res);
    mySql.createNewInfoStudents(dataForm);
    res.writeHead(301, {location: "/controller"});
    res.end();
  }
  async showEditDetails(req, res, path, index) {
    let viewMangerStudents = await mySql.getViewManagerStudent();
    let html = "";
    fs.readFile(path, "utf-8", (err, data) => {
      viewMangerStudents.forEach((element, id) => {
        if (element.id == index) {
          html = `<tr>
          <form method="post">
            <td><input class="input-edit-details" name="name" value="${element.name}" type="text" /></td>
            <td><input class="input-edit-details" name="age" value="${element.age}" type="text" /></td>
            <td><input class="input-edit-details" name="className" value="${element.className}" type="text" /></td>
            <td><button type="submit" class="btn-fromManager">Sửa</button></td>
            </form>
          </tr>`;
          return;
        }
      });
      data = data.replace("{change}", html);
      res.write(data);
      res.end();
    });
  }
  async editDetails(req, res, path, index) {
    let dataForm = await this.getDataReq(req, res);
    let name = dataForm.name;
    let age = dataForm.age;
    let className = dataForm.className;
    mySql.editFromStudents(name, age, index);
    mySql.editFromClass(className, index);
    res.writeHead(301, {location: "/admin"});
    res.end();
  }
  async showViewEditScore(req, res, path, index) {
    let html = "";
    let viewMangerStudents = await mySql.getViewManagerStudent();
    viewMangerStudents.forEach((element) => {
      if (element.id == index) {
        html = `
        <form action="" method="post" class="form-edit-score">
        <input
          type="number"
          class="input-edit-scores"
          name="math"
          value="${element.math}"
          placeholder="Toán"
        />
        <input
          type="number"
          class="input-edit-scores"
          name="physic"
          value="${element.physic}"
          placeholder="Lý"
        />
        <input
          type="number"
          class="input-edit-scores"
          name="chemistry"
          value="${element.chemistry}"
          placeholder="Hóa"
        />
        <button type="submit" class="btn-edit-scores">Sửa</button>
      </form>
        `;
      }
    });
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      data = data.replace("{change}", html);
      res.write(data);
      res.end();
    });
  }
  async editScoreStudents(req, res, index) {
    let data = await this.getDataReq(req, res);
    let math = Number(data.math);
    let physic = Number(data.physic);
    let chemistry = Number(data.chemistry);
    mySql.editScoreStudents(math, physic, chemistry, index);
    res.writeHead(301, {location: `/details?${index}`});
    res.end();
  }
}

module.exports = ManagerController;
