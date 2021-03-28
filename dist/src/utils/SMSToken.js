function getRandomNumAsString() {
  return Math.floor(Math.random() * 10) + '';
}

function getSMSToken(iterations, token = '') {
  if (iterations == 0) return token;
  return getSMSToken(iterations - 1, getRandomNumAsString() + token);
}

export { getSMSToken };