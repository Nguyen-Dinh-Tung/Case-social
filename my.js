const http = require("http");
const fs = require("fs");
const qs = require("qs");
const port = 3000;
const host = "localhost";
const url = require("url");
const cookie = require("cookie");
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
  "./src/views/home.html",
  "./src/views/manager.html",
];

const urlName = ["/login", "/home", "/manager"];
const server = http.createServer((req, res) => {
  let urlPathName = url.parse(req.url).pathname;
  const method = req.method;
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
          manager.test();
        }
        break;
    }
  }
});
server.listen(port, host);
const io = new Server(server);

io.on("connection", (socket) => {});
