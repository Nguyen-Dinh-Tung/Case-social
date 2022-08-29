const http = require("http");
const fs = require("fs");
const qs = require("qs");
const port = 3000;
const host = "localhost";
const url = require("url");
const mysql = require("mysql");
const cookie = require("cookie");
const escapeHtml = require("escape-html");
const {type} = require("os");
const {Server} = require("socket.io");
const mimeTypes = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
};
const server = http.createServer((req, res) => {
  let urlPathName = url.parse(req.url).pathname;
  switch (urlPathName) {
    case "/":
      res.writeHead(200, {"content-type": "text/html"});
      fs.createReadStream("./views/index.html").pipe(res);
      break;
  }
  const fileDefences = req.url.match(/\.js|.css/);
  if (fileDefences) {
    const extension = mimeTypes[fileDefences[0].toString().split(".")[1]];
    res.writeHead(200, {"content-type": extension});
    fs.createReadStream(__dirname + "/" + req.url).pipe(res);
  }
});
server.listen(port, host);
const io = new Server(server);
const users = [
  {
    name: "admin",
    online: false,
    color: "red",
  },
  {
    name: "phong",
    online: false,
    color: "red",
  },
  {
    name: "user",
    online: false,
    color: "red",
  },
];
io.on("connection", (socket) => {
  socket.on("login", (name) => {
    let userLogin = users.find((user) => {
      return user.name == name;
    });
    if (userLogin) {
      userLogin.online = true;
      userLogin.color = "green";
      userLogin.id = socket.id;
      socket.emit("list-user", users);
      socket.broadcast.emit("user-connected", users);
    }
  });
  socket.on("disconnect", () => {
    let userLogin = users.find((user, index) => {
      return user.id === socket.id;
    });
    if (userLogin) {
      console.log(userLogin);
      userLogin.online = false;
      userLogin.color = "red";
      socket.broadcast.emit("user-disconnected", users);
    }
  });
});
