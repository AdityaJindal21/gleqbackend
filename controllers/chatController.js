var {getChatModel} = require('../models/chatModel');
var path = require("path");
var ChatModel = getChatModel();


async function getMessagesByGroup(req,res)
{
    try {
    const messages = await ChatModel.find({ groupId: req.params.groupId }).sort({ timestamp: 1 });
    res.json({ status: true, messages });
  } catch (err) {
    res.status(500).json({ status: false, msg: "Error fetching messages", error: err.message });
  }
}


const saveMessage = async (dataOrReq, resp = null) => {
  const data = dataOrReq.body || dataOrReq;

  const chtobj = new ChatModel({
    groupId: data.groupId,
    senderId: data.senderId,
    senderName:data.senderName,
    text: data.text,
    timestamp: new Date()
  });

  try {
    await chtobj.save();
    if (resp) {
      resp.json({ status: true, msg: "Message saved" });
    }
  } catch (err) {
    console.error("Save error:", err.message);
    if (resp) {
      resp.status(500).json({ status: false, msg: "Failed to save message", error: err.message });
    }
  }
};


module.exports = {getMessagesByGroup, saveMessage}

