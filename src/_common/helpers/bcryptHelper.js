import bcrypt from "bcrypt";

export const hashPass = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const bcryptCheckPass = async (userPassword, hashedPass) => {
  return await bcrypt.compare(userPassword, hashedPass);
};
