const http = require("http");
const fs = require("fs");
const qs = require("qs");
const port = 3000;
const host = "localhost";
const url = require("url");
const escapeHtml = require("escape-html");
const {type} = require("os");
const ManagerController = require("./controller/ManagerController");
const manager = new ManagerController();
const {Server} = require("socket.io");
let mimeTypes = {
  jpg: "images/jpg",
  png: "images/png",
  js: "text/javascript",
  css: "text/css",
  svg: "image/svg+xml",
  ttf: "font/ttf",
  woff: "font/woff",
  woff2: "font/woff2",
  eot: "application/vnd.ms-fontobject",
};
const path = [
  "./src/views/login.html",
  "./src/views/students.html",
  "./src/views/manager.html",
  "./src/views/details.html",
  "./src/views/controller.html",
  "./src/views/create.html",
];
const urlName = [
  "/",
  "/admin",
  "/details",
  "/delete",
  "/controller",
  "/edit",
  "/create",
];
const server = http.createServer(async (req, res) => {
  let urlPathName = url.parse(req.url).pathname;
  const method = req.method;
  let index = url.parse(req.url).query;
  const filesDefences = urlPathName.match(
    /\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot/
  );
  if (filesDefences) {
    const extension = mimeTypes[filesDefences[0].toString().split(".")[1]];
    res.writeHead(200, {"content-type": extension});
    fs.createReadStream(__dirname + "/" + req.url).pipe(res);
  } else {
    switch (urlPathName) {
      case urlName[0]:
        if (method == "GET") {
          manager.getTemplate(req, res, path[0]);
        } else {
          manager.login(req, res, path[1], path[2]);
        }
        break;
      case urlName[1]:
        manager.viewAdmin(req, res, path[2]);
        break;
      case urlName[2]:
        manager.viewUsers(req, res, path[3], index);
        break;

      case urlName[4]:
        manager.showViewUserLogin(req, res, path[4]);
        break;
      case urlName[5]:
        if (method == "GET") {
          manager.viewEditUsers(req, res, path[4], index - 1);
        } else {
          manager.editUsers(req, res, index);
        }
        break;
      case urlName[6]:
        if (method == "GET") {
          manager.showFormCreate(req, res, path[5]);
        } else {
          manager.createUsers(req, res);
        }
        break;
    }
  }
});
server.listen(port, host);
const io = new Server(server);

io.on("connection", (socket) => {});
