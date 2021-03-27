import bcrypt from "bcrypt";

function hashPass(password) {
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function bcryptCheckPass(userPassword, hashedPass) {
  return bcrypt.compareSync(userPassword, hashedPass);
}

export { hashPass, bcryptCheckPass };
