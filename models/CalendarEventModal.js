const mongoose = require('mongoose')

function getCalendarEventModel()
{
    var eventscheema = mongoose.Schema;
    
    var userEventSchema = {
        email:{type:String, required:true},
        date: {type: String, required: true},
        title: {type: String,required: true},
        time: {type: String,required: true}
    }
    var version={
        versionKey:false
    }
    var UserScheema = new eventscheema(userEventSchema,version);
    
    var Usereventref = mongoose.model("Event",UserScheema);
    return Usereventref;
}

module.exports = {getCalendarEventModel}