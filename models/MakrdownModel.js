const mongoose = require('mongoose')

function getMarkdownModel()
{
    var userMarkdownscheema = mongoose.Schema;
    
    var userContentSchema = {
         groupId: {type: mongoose.Schema.Types.ObjectId,ref: 'StudyPod',required: true},
        content: {type: String,default: ""},
        lastUpdated: {type: Date,default: Date.now,},
    }
    var version={
        versionKey:false
    }
    var UserScheema = new userMarkdownscheema(userContentSchema,version);
    
    var UserContentref = mongoose.model("GroupNotes",UserScheema);
    return UserContentref;
}

module.exports = {getMarkdownModel}