// reset-password.js
const bcrypt = require('bcrypt');

const newPassword = "123456";
bcrypt.hash(newPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
