const { ChannelModel } = require("../model/channel");
const { ChannelModule } = require("../module/channel");

let chatController = {
  async getChannels(req, res, next) {
    let id = req.query.id;
    let channels =await  ChannelModule.getChannels(id);

    
    return res.status(200).send({
      isSuccessed: true,
      data: channels,
      error: null,
    });
  },
};

export { chatController };
