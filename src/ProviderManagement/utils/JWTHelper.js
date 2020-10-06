import jwt from "jsonwebtoken";

function generateProviderToken(id, role) {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.TOKEN_SECRET
  );
}
function decodeProviderToken(auth) {
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
export { generateProviderToken, decodeProviderToken };
