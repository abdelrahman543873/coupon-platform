import { Room } from "../module/Room";
import { NotificationModule } from "../../CloudMessaging/module/notification";

class Rooms {
  constructor() {
    this.rooms = new Map();
    this.usersRooms = new Map();
  }

  async addRoom(roomId, users) {
    let room = await Room.build(roomId, users);
    this.rooms.set(roomId, room);
    return room.getLoadedDBMessagesSize();
  }

  isRoomExist(roomId) {
    return this.rooms.has(roomId);
  }

  getUserList(roomId){
    return this.rooms.get(roomId).users;
  }

  isUserInRoom(roomId, userId) {
    if (this.rooms.has(roomId))
      return this.rooms.get(roomId).isUserExist(userId);
    return null;
  }

  addMessage2Room(roomId, message) {
    console.log(message);
    if (this.rooms.has(roomId)){
      this.rooms.get(roomId).addMessage(message);
      console.log(this.getUserList(roomId).length);
      //if(this.getUserList(roomId).length == 1){
        NotificationModule.sendChatNotification(message);
     // }
    }
  }

  addUser2Room(roomId, userId) {
    console.log("2-"+roomId);
    if (this.rooms.has(roomId)) this.rooms.get(roomId).addUser(userId);
  }

  updateLoadedFromDBinRoom(roomId, size) {
    if (this.rooms.has(roomId))
      this.rooms.get(roomId).setLoadedFromDBSize(size);
  }

  removeUserFromRoom(roomId, userId) {
    // console.log("room  ",roomId);
    // console.log("befor  ",this.rooms.getUserList(roomId));
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).removeUser(userId);
      let userRooms = this.usersRooms.get(userId);
      if (userRooms) {
        this.usersRooms.set(
          userId,
          userRooms.filter((room) => room !== roomId)
        );
      }
      let roomUsers = this.rooms.get(roomId).getUserList();
      if (roomUsers.length < 1) {
        this.__removeRoom(roomId);
      }
    }
    //console.log("after  ",this.rooms.getUserList(roomId));
  }

  async getRoomMessages(data) {
    //console.log("roomId:  " + JSON.stringify(this.rooms));
    return await this.rooms.get(data.roomId).getMessages(data);
  }

  addRoom2User(user, room) {
    if (!this.usersRooms.has(user)) {
      this.usersRooms.set(user, [room]);
    } else {
      this.usersRooms.get(user).push(room);
    }
  }

  getUserRooms(user) {
    if (this.usersRooms.has(user)) return this.usersRooms.get(user);
  }

  removeUsersRooms(user) {
    this.__removeUser(user);
  }

  getLoadedSize(roomId) {
    return this.rooms.get(roomId).loadedDBMessagesSize;
  }

  onDisconnect(user) {
    let userRooms = this.getUserRooms(user);
    if (userRooms)
      userRooms.map((room) => {
        this.removeUserFromRoom(room, user);
      });
    this.removeUsersRooms(user);
  }

  __removeRoom(roomId) {
    this.rooms.delete(roomId);
  }

  __removeUser(user) {
    this.usersRooms.delete(user);
  }
}

export { Rooms };
