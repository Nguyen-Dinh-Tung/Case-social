class UsersChat {
  usersLogin;
  usersSearch;
  singleRoom;
  constructor(usersLogin, usersSearch) {
    this.usersLogin = usersLogin;
    this.usersSearch = usersSearch;
  }
  setSingleRoom(nameRoom) {
    this.singleRoom = nameRoom;
  }
}
module.exports = UsersChat;
