const mongoose = require('mongoose');

function getChatModel()
{
    var ChatScheema = mongoose.Schema;
    
    var userChatSchema = {
      groupId: {  type: mongoose.Schema.Types.ObjectId, ref: "StudyPod", required: true },
      senderId: {  type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      senderName: {type:String, required:true},
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
    var version={
        versionKey:false
    }
    var chatScheema = new ChatScheema(userChatSchema,version);
    
    var ChatModel = mongoose.model("Chat",chatScheema);
    return ChatModel;
}

module.exports = {getChatModel}