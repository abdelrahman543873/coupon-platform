import { ChannelModule } from "../module/channel";
import { Rooms } from "../utils/Rooms";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import isBase64 from "is-base64";
import shortid from "shortid";

let rooms = new Rooms();

// Joi validation on sent data will be added soon
const SocketEvents = {
  async onNewChannel(socket, users, callback) {
    console.log(JSON.stringify(users));
    if (users.length < 2) {
      return callback(
        SocketEvents.retrunTemplate(
          false,
          "more than one user required to start chat"
        )
      );
    }

    for (let i = 0; i < users.length; i++) {
      console.log("12345----- " + users[i].id);
      if (
        !users[i].id ||
        !SocketEvents.isMongoId(users[i].id) ||
        !users[i].type
      ) {
        return callback(
          SocketEvents.retrunTemplate(false, "not allow null id or type!")
        );
      }
    }

    let usrsStr = ChannelModule.getUsersStr(users),
      channel = await ChannelModule.getByUsrsStr(usrsStr);

    if (channel) {
      if (!rooms.isRoomExist(channel._id + "")) {
        rooms.addRoom(channel._id + "", [socket.id]);
      }
    } else {
      channel = await ChannelModule.add(usrsStr);
      if (!channel)
        return callback(
          SocketEvents.retrunTemplate(false, "Error initialize chat channel")
        );
      rooms.addRoom(channel._id + "", [socket.id]);
    }
    socket.emit("channelCreated", channel._id);
    callback(SocketEvents.retrunTemplate(true, null));
  },

  async onJoin(socket, roomId, callback) {
    if (!roomId)
      return callback(SocketEvents.retrunTemplate(false, "room id required"));
    if (rooms.isRoomExist(roomId)) {
      //  console.log("exist:  "+roomId);
      // console.log("1-"+rooms.getUserList(roomId)+"-----"+socket.id);
      if (!rooms.isUserInRoom(roomId, socket.id)) {
        //console.log("rooooom:  "+roomId);
        rooms.addUser2Room(roomId, socket.id);
      }
    } else {
      //console.log("not:  "+roomId);
      await rooms.addRoom(roomId, [socket.id]);
    }
    socket.join(roomId);
    rooms.addRoom2User(socket.id, roomId);
    socket.emit("joined", rooms.getLoadedSize(roomId));
    return callback(SocketEvents.retrunTemplate(true, null));
  },

  async onMessage(io, message, callback) {
    console.log(message.channelId);
    let checkRes = SocketEvents.isValidMessage(message);
    if (!checkRes.isSuccessed) return callback(checkRes);
    message.id = shortid.generate() + message.channelId;
    rooms.addMessage2Room(message.channelId, message);
    io.to(message.channelId).emit("newMessage", message);
    if (rooms.getUserList(message.channelId).length == 1)
      await ChannelModule.setLastMessage(message.channelId, message);
    return callback(SocketEvents.retrunTemplate(true, null));
  },

  async onRequestMessages(socket, data, callback) {
    console.log("rooom: ",data.roomId)
    if (!data || !data.roomId || data.inRoomOnly == null)
      return callback(
        SocketEvents.retrunTemplate(false, "Room Id is Required")
      );
    if (!data.inRoomOnly) {
      if (!data.skip)
        return SocketEvents.retrunTemplate(
          false,
          "skip required for pagination"
        );
    }
    let messages = await rooms.getRoomMessages(data);
    console.log("messages: ",messages)
    socket.emit("appendMessages", { data: messages });
    //console.log(messages);
    return callback(SocketEvents.retrunTemplate(true, null));
  },

  async onUploadImage(io, message, callback) {
    //console.log('data',message.data);
    let checkRes = SocketEvents.isValidMessage(message);
    if (!checkRes.isSuccessed) return callback(checkRes);

    if (
      !isBase64(message.data.toString("base64"), {
        allowEmpty: false,
        allowMime: true,
      })
    ) {
      console.log("data   ", message.data);
      return callback(SocketEvents.retrunTemplate(false, "Malformed file!"));
    }
    message.text = Date.now() + message.text.split(" ").join("");
    let writer = fs.createWriteStream(
      path.join("Chat-Images/" + message.text),
      {
        encoding: "base64",
      }
    );
    message.text =
      "http://api.bazar.alefsoftware.com/api/v1/chat/chat-images/" +
      message.text;
    writer.write(message.data);
    writer.end();

    writer.on("finish", function () {
      message.id = shortid.generate()+ message.channelId;
      io.to(message.channelId).emit("imageUploaded", message);
    });

    writer.on("error", function (err) {
      return callback(SocketEvents.retrunTemplate(false, "bad data"));
    });
    delete message.data;
    rooms.addMessage2Room(message.channelId, message);
    return callback(SocketEvents.retrunTemplate(true, null));
  },

  async onLeave(socket, roomId, callback) {
    if (!roomId) {
      return callback(
        SocketEvents.retrunTemplate(false, "Room Id is Required")
      );
    }
    rooms.removeUserFromRoom(roomId, socket.id);
    return callback(SocketEvents.retrunTemplate(true, null));
  },

  async onTyping(io, data, callback) {
    if (!data || !data.channelId || !data.from)
      return callback(SocketEvents.retrunTemplate(false, "missing data"));
    io.to(data.channelId).emit("typingEvent", data.from);
    return callback(SocketEvents.retrunTemplate(true, null));
  },

  async onDisconnect(socket) {
    console.log("dis:  " + socket.id);
    rooms.onDisconnect(socket.id);
    //console.log(rooms.getUserList(roomId));
  },

  retrunTemplate(isSuccessed, error) {
    return {
      isSuccessed,
      error,
    };
  },

  isMongoId(id) {
    if (!id) return false;
    try {
      return id == new mongoose.Types.ObjectId(id) + "" ? true : false;
    } catch (err) {
      return false;
    }
  },

  isValidMessage(message) {
    let { text, channelId, from, type, date } = message;
    if (!text || !channelId || !from || !type || !date)
      return SocketEvents.retrunTemplate(false, "Bad data, missing properties");

    if (new Date(date) == "Invalid Date")
      return SocketEvents.retrunTemplate(
        false,
        "Bad data, malformed date formate"
      );

    if (!SocketEvents.isMongoId(from.id))
      return SocketEvents.retrunTemplate(
        false,
        `Bad data, malformed id: ${from}`
      );

    return SocketEvents.retrunTemplate(true, null);
  },
};

export { SocketEvents };
