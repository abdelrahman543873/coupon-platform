import jwt from "jsonwebtoken";

function generateToken(id, type = "") {
  return jwt.sign(
    {
      id,
      type
    },
    process.env.TOKEN_SECRET
  );
}

function decodeToken(auth) {
  try {
    let token = auth.replace("Bearer ", ""),
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if(decoded && decoded.id){
      return decoded.id
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

function decodeTokenAndGetType(auth) {
  try {
    let token = auth.replace("Bearer ", ""),
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if(decoded && decoded.id){
      return decoded;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export { generateToken, decodeToken, decodeTokenAndGetType };
