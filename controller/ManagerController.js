const fs = require("fs");
const qs = require("qs");
const SqlController = require("../sql/SqlController");
const sqlController = new SqlController();
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

  getDataReq(req, res) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let users = qs.parse(data);
      console.log(users);
    });
  }
  test() {
    sqlController.getDatabase();
  }
}

module.exports = ManagerController;
