const fs = require("fs");
const qs = require("qs");
const SqlController = require("../sql/SqlController");
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

  getDataReq(req, res) {
    return new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        let users = qs.parse(data);
        resolve(users);
      });
    });
  }
  async login(req, res, pathUser, pathAdmin) {
    let dataForm = await this.getDataReq(req, res);
    let dataViewLogin = await mySql.getViewLogin();
    let role = -1;
    let idStudent = -1;
    dataViewLogin.forEach((element, index) => {
      if (dataForm.users == element.users && dataForm.pass == element.pass) {
        if (element.role == 1) {
          this.viewAdmin(req, res, pathAdmin);
          console.log("check 2");
        } else {
          idStudent = index;
          console.log(idStudent);
          this.viewUsers(req, res, pathUser, idStudent);
        }
      }
    });
  }

  async viewAdmin(req, res, pathAdmin) {
    let html = "";
    let viewMangerStudents = await mySql.getViewStudents();
    viewMangerStudents.forEach((element, index) => {
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
            <td><a href="/edit?${element.id}"><button class="btn-fromManager" type="submit">Sửa</button></a></td>
            </tr>
            `;
    });
    this.getTemplateLogin(req, res, pathAdmin, html);
  }
  async viewUsers(req, res, pathAdmin, id) {
    let html = "";
    let viewMangerStudents = await mySql.getViewStudents();
    let classicfy = "";
    let scoreAvg = Math.floor(viewMangerStudents[id].avg);
    if (scoreAvg <= 5) {
      classicfy = "Kém";
    } else if (scoreAvg >= 5 && scoreAvg <= 7) {
      classicfy = "Khá";
    } else {
      classicfy = "Giỏi";
    }
    html += `
              <tr>
              <td>${viewMangerStudents[id].name}</td>
              <td>${viewMangerStudents[id].math}</td>
              <td>${viewMangerStudents[id].physic}</td>
              <td>${viewMangerStudents[id].chemistry}</td>
              <td>${viewMangerStudents[id].avg}</td>
              <td>${classicfy}</td>
              </tr>
              `;
    this.getTemplateLogin(req, res, pathAdmin, html);
  }
  async deleteStudents(req, res, index) {
    let viewMangerStudents = await mySql.getViewStudents();
    viewMangerStudents.splice(index, 1);
    res.writeHead(301, {location: "/admin"});
    res.end();
  }
}

module.exports = ManagerController;
