const users = [];

exports.addUser = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

exports.disconnectUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//Get User List in same room
exports.getSameUsers = (room) => {
  return users.filter((user) => user.room == room);
};
