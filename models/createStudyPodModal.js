const mongoose = require('mongoose')

function getCreateStudyPodModel()
{
    var userPodCreationscheema = mongoose.Schema;
    
    var userStudyPodSchema = {
        email:{type:String, required:true, index:true},
        GroupName: {type: String, required:true},
        PassKey: {type: String, required:true},
        Description: {type: String, default: ""},
        CreatedAt: {type: Date, default: Date.now},
        members: {type: [String], default: []},
        GroupIcon: {type: String, default: ""}
    }
    var version={
        versionKey:false
    }
    var UserPodScheema = new userPodCreationscheema(userStudyPodSchema,version);
    
    var UserPodref = mongoose.model("StudyPod",UserPodScheema);
    return UserPodref;
}

module.exports = {getCreateStudyPodModel}