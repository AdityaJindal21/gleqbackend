const mongoose = require('mongoose')

function getUserModal()
{
    var userCreationscheema = mongoose.Schema;
    
    var userSchema = {
        name: {type: String, required:true},
        email:{type:String, required:true, index:true, unique: true},
        password:{type:String, required:true},
        otp: { type: String },      
        otpExpires: { type: Date },
        createdAt: { type: Date, default: Date.now }
    }
    var version={
        versionKey:false
    }
    var UserScheema = new userCreationscheema(userSchema,version);
    
    var Userref = mongoose.model("User",UserScheema);
    return Userref;
}

module.exports = {getUserModal}