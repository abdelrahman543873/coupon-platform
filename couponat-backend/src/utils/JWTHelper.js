import jwt from "jsonwebtoken";

function generateToken(id, type = "") {
  return jwt.sign(
    {
      id,
      type
    },
    "<Hey,Thi$i$CoUpOnAtTokeNSecret/>"
  );
}

async function decodeToken(auth) {
  try {
    let token = auth.replace("Bearer ", ""),
      decoded = jwt.verify(token,"<Hey,Thi$i$CoUpOnAtTokeNSecret/>");
    if(decoded && decoded.id){
      return decoded
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export { generateToken, decodeToken};
