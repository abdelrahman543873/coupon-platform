import jwt from "jsonwebtoken";

function generateToken(id, type = "") {
  return jwt.sign({
    id,
    type
  }, process.env.JWT_SECRET);
}

async function decodeToken(auth) {
  try {
    let token = auth.replace("Bearer ", ""),
        decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded && decoded.id) {
      return decoded;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export { generateToken, decodeToken };