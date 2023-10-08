const users = [];

// join user to chat
function userJoin(id, username, chatKey) {
   const user = { id, username, chatKey };

   users.push(user);

   return user;
}

// get current user
function getCurrentUser(id) {
   return users.find((user) => user.id === id);
}

// user leaves chat
function userLeave(id) {
   const index = users.findIndex((user) => user.id === id);

   if (index !== -1) {
      return users.splice(index, 1)[0];
   }
}

// get room users
function getRoomUsers(chatKey) {
   return users.filter((user) => user.chatKey === chatKey);
}

module.exports = {
   userJoin,
   getCurrentUser,
   userLeave,
   getRoomUsers,
};
