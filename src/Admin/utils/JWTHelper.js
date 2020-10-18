import jwt from "jsonwebtoken";

function generateAdminToken(id, role) {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.TOKEN_SECRET
  );
}
function decodeAdminToken(auth) {
  try {
    let token = auth.replace("Bearer ", ""),
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return {
      id: decoded.id,
      role: decoded.role,
    };
  } catch (err) {
    return null;
  }
}
export { generateAdminToken, decodeAdminToken };
