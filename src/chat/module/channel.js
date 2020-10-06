import { ChannelModel } from "../model/channel";
import { ProviderModel } from "../../ProviderManagement/models/provider";
import { ClientModel } from "../../CustomersManagement/models/client";
import { AdminModel } from "../../Admin&PlatformSpec/models/admin";

const ChannelModule = {
  async add(usrsStr) {
    console.log(usrsStr);
    return await ChannelModel({ usrsStr })
      .save()
      .catch((err) => {
        console.log(err);
        return null;
      });
  },
  async getById(id) {
    return await ChannelModel.findById(id);
  },

  async setLastMessage(id, message) {
    console.log("typeee   ", message.type);
    console.log(message);
    let channel = await this.getById(id);
    if (!channel) return null;
    let setLast = await ChannelModel.findByIdAndUpdate(
      id,
      {
        $set: {
          lastMessage: message.text,
          lastType: message.type,
        },
      },
      { new: true }
    );

    console.log(setLast);
    // channel.lastMessage = message.text;
    // channel.lastType=message.type;
    // await channel.save();
    return setLast;
  },

  async getByUsrsStr(usrsStr) {
    return await ChannelModel.findOne({ usrsStr });
  },

  getUsersStr(users) {
    return users
      .map((user) => {
        return user.type[0] + ":" + user.id;
      })
      .sort()
      .join(",");
  },

  async getChannels(userId) {
    let channels = await ChannelModel.find({
      usrsStr: new RegExp(userId, "i"),
    });
    let channelsArray = [];
    console.log(userId);
    if (!channels) return [];
    else {
      for (let i = 0; i < channels.length; i++) {
        let providers = [],
          providersArray,
          customers = [],
          customersArray,
          admins = [],
          adminsArray,
          type,
          user;
        let userArray = channels[i].usrsStr.split(",");

        for (let j = 0; j < userArray.length; j++) {
          let obj = userArray[j].split(":");
          if (obj[0] == "C" && obj[1] != userId) customers.push(obj[1]);
          else if (obj[0] == "P" && obj[1] != userId) providers.push(obj[1]);
          else if (obj[0] == "A" && obj[1] != userId) admins.push(obj[1]);
        }

        if (providers.length != 0) {
          providersArray = await ProviderModel.find(
            {
              _id: { $in: [providers] },
            },
            {
              username: 1,
              email: 1,
              imageUrR: 1,
              roles: 1,
              countryCode: 1,
              phone: 1,
              gender: 1,
              bazar: 1,
            }
          ).populate("bazar");
          user = providersArray[0];
          type = "provider";
        }

        if (customers.length != 0) {
          customersArray = await ClientModel.find(
            {
              _id: { $in: [customers] },
            },
            {
              username: 1,
              email: 1,
              imgURL: 1,
              mobile: 1,
              countryCode: 1,
            }
          );
          user = customersArray[0];
          type = "customer";
        }

        if (admins.length != 0) {
          adminsArray = await AdminModel.find({ _id: { $in: [admins] } });
          type = "Admin";
          user = adminsArray[0];
        }
        channelsArray.push({
          channelId: channels[i]._id,
          lastMessage: channels[i].lastMessage,
          users: {
            user,
            // providers: providersArray,
            // customers: customersArray,
            // admins: adminsArray,
            type: type,
          },
        });
      }
      return channelsArray;
    }
  },
};

export { ChannelModule };
