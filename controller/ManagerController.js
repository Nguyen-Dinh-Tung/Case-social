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
    let userLogin = await mySql.getLoginUser();
    let dataLogin = userLogin.concat(await mySql.getLoginAdmin());
    let role = -1;
    let idStudent = -1;
    dataLogin.forEach((element, index) => {
      if (dataForm.users == element.users && dataForm.pass == element.pass) {
        if (element.role == 1) {
          this.viewAdmin(req, res, pathAdmin);
        } else {
          idStudent = index;
          this.viewUsers(req, res, pathUser, idStudent);
        }
      }
    });
  }

  async viewAdmin(req, res, pathAdmin) {
    let html = "";
    let dbViewStudnet = await mySql.getDbViewStudent();
    dbViewStudnet.forEach((element, index) => {
      html += `
            <tr>
            <td>${index + 1}</td>
            <td>${element.name_students}</td>
            <td>${element.age_students}</td>
            <td>${element.name_class}</td>
            <td>Xếp loại</td>
            </tr>
            `;
    });
    this.getTemplateLogin(req, res, pathAdmin, html);
    console.log("check view Admin");
  }
  async viewUsers(req, res, pathAdmin, id) {
    let html = "";
    let dbViewStudent = await mySql.getDbViewScores(id);
    dbViewStudent.forEach((element, index) => {
      let avg =
        (parseFloat(element.toan) +
          parseFloat(element.ly) +
          parseFloat(element.hoa)) /
        3;

      html += `
            <tr>
            <td>${element.toan}</td>
            <td>${element.ly}</td>
            <td>${element.hoa}</td>
            <td>${avg.toFixed(1)}</td>
            </tr>
            `;
    });
    this.getTemplateLogin(req, res, pathAdmin, html);
  }
}

module.exports = ManagerController;
