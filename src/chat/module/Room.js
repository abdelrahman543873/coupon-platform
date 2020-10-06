import { ChatModule } from "./chat";
import { ChannelModule } from "./channel";

class Room {
  fromBuilder = false;

  constructor(id, users, loadedDBMessagesSize = 0, messages = []) {
    if (!Room.fromBuilder) {
      throw new Error("Cannot be called directly");
    }
    Room.fromBuilder = false;
    this.id = id;
    this.users = users;
    this.messages = messages;
    this.loadedDBMessagesSize = loadedDBMessagesSize;
    this.newMessages = [];
  }

  static async build(id, users) {
    let loadedMessages = (await ChatModule.getMessages(id, 0, 10)).reverse();
    this.fromBuilder = true;
    return new Room(id, users, loadedMessages.length, loadedMessages);
  }

  addUser(id) {
    return this.users.push(id);
  }

  getLoadedDBMessagesSize() {
    return this.loadedDBMessagesSize;
  }

  setLoadedDBMessagesSize(size) {
    this.loadedDBMessagesSize = size;
  }

  isUserExist(id) {
    return this.users.indexOf(id) > -1;
  }

  getUserList() {
    return this.users;
  }

  removeUser(id) {
    this.users = this.users.filter((userId) => userId !== id);
    if (this.users.length == 0) this.saveToDB();
  }

  saveToDB() {
    console.log("Mesages: ", this.newMessages);
    let messages = this.newMessages;
    if (messages.length > 0) {
      console.log("leng: ", messages.length);
      ChatModule.saveMessges(messages);
    }
  }

  addMessage(message) {
    return this.newMessages.push(message);
  }

  async getMessages(data) {
    console.log("room:  ", data.roomId);
    if (data.inRoomOnly) {
      let mess = this.messages.concat(this.newMessages);
      console.log("room Mess: ", mess);
      return mess;
    } else {
      let mess = await ChatModule.getMessages(
        data.roomId,
        data.skip,
        10
      ).reverse();
       console.log("db Mess: ", mess);
      return await mess;
    }
  }
}

export { Room };
