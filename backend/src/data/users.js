const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    email: "angel@gmail.com",
    passwordHash: bcrypt.hashSync("123456", 10)
  },
  {
    id: 2,
    email: "luisa@gmail.com",
    passwordHash: bcrypt.hashSync("123456", 10)
  }
];

module.exports = users;
