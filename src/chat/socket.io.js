import SocketIO from "socket.io";
import { SocketEvents } from "./controllers/socketEvents";
import { decodeTokenAndGetType } from "../utils/JWTHelper";

function attachSocketIO(server) {
  let io = SocketIO(server);
   io.origins("*:*");
  // io.set("transports", ["websocket"]);
  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      let auth = socket.handshake.query.token;
      //console.log(auth);
      let decodeAuth = decodeTokenAndGetType(auth);
    //  console.log(decodeAuth);
      if (!decodeAuth) {
        return next(new Error("Authentication error"));
      }
    } else {
      return next(new Error("Authentication error"));
    }
    next();
  });
  io.on("connection", (socket) => {
    console.log("connected");
    socket.on("newChannel", SocketEvents.onNewChannel.bind(null, socket));
    socket.on("join", SocketEvents.onJoin.bind(null, socket));
    socket.on("message", SocketEvents.onMessage.bind(null, io));
    socket.on(
      "requestMessages",
      SocketEvents.onRequestMessages.bind(null, socket)
    );
    socket.on("uploadImage", SocketEvents.onUploadImage.bind(null, io));
    socket.on("typing", SocketEvents.onTyping.bind(null,io));
    socket.on("leave", SocketEvents.onLeave.bind(null, socket));
    socket.on("disconnect", SocketEvents.onDisconnect.bind(null, socket));
  });
  return server;
}

export { attachSocketIO };
