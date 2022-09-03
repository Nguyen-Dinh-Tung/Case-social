const socket = io("http://localhost:3000");
let usersLogin = document.querySelector(".my-user-name").value;
let usersSearch = document.querySelector(".search-users-chat");
let btnSearch = document.querySelector(".btn-search-chat");
let btnSend = document.querySelector(".btn-send");
let contentChat = document.querySelector(".content-chat");
socket.emit("login", usersLogin);
btnSearch.addEventListener("click", handleSearch);
btnSend.addEventListener("click", handleSend);
let idRoom = "";
function handleSearch() {
  let dataSearch = {
    usersLogin: usersLogin,
    usersSearch: usersSearch.value,
  };
  socket.emit("search users", dataSearch);
}
socket.on("id room", (id) => {
  idRoom = id;
  console.log(idRoom);
});
function handleSend() {
  let message = document.querySelector(".message");
  let dataMessage = {
    usersLogin: usersLogin,
    message: message.value,
    idRoom: idRoom,
  };
  socket.emit("on-chat", dataMessage);
}
socket.on("chat", (dataMessage) => {
  let message = document.createElement("li");
  message.textContent = dataMessage.message;
  contentChat.appendChild(message);
  if (dataMessage.usersLogin == usersLogin) {
    message.style.textAlign = "right";
  }
});
