export const createVerificationCode = () => {
  const code =
    process.env.NODE_ENV === "production"
      ? Math.floor(1000 + Math.random() * 9000)
      : 12345;
  const expirationDate =
    Date.now() + Number(process.env.OTP_EXPIRY_TIME) * 1000 * 60;
  return { code, expirationDate };
};

const getRandomNumAsString = () => {
  return Math.floor(Math.random() * 10) + "";
};

export const getSMSToken = (iterations, token = "") => {
  if (iterations == 0) return token;
  return getSMSToken(iterations - 1, getRandomNumAsString() + token);
};
