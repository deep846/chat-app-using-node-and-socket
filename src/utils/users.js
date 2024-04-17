const users = [];

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

const addUser = ({ id, username, room }) => {
  //clean the data by trimming
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // validating the data

  if (!username || !room) {
    return {
      error: "username and room are required",
    };
  }

  // check for existing users
  const exitstingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (exitstingUser) {
    return {
      error: "Username already exists in the room",
    };
  }

  // storing a user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const getUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index != -1) {
    return users[index];
  }

  return undefined;
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room.toString().toLowerCase() === room.toString().trim().toLowerCase());

};



module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};








// // Test cases
// addUser({ id: 22, username: "  Deep  ", room: "  Deeproom  " });
// addUser({ id: 23, username: "Deep    ", room: " Deeeproom" });
// addUser({ id: 24, username: "Deep    ", room: " Deproom" });

// console.log(users);

// let res = addUser({ id: 25, username: "afsadf", room: "" });
// console.log(res);
// res = addUser({ id: 26, username: "Deep", room: "  Deeproom" });
// console.log(res);

// const res2 = removeUser(22);
// console.log(res2);
// console.log(users);
// const res3 = getUser(25);
// console.log(res3);


// addUser({ id: 30, username: "  Deep  ", room: "  Deepu  " });
// addUser({ id: 31, username: "  Deep1  ", room: "  Deepu  " });
// addUser({ id: 32, username: "  Deep2  ", room: "  Deepu  " });


// const res4 = getUsersInRoom("Deeeproom");
// console.log(res4);

