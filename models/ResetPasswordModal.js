const mongoose = require('mongoose')

function getResetPasswordModal()
{
    var userscheema = mongoose.Schema;
    
    var OTPSchema = {
        email:{type:String, required:true},
        otp: { type: String },      
        otpExpires: { type: Date },
    }
    var version={
        versionKey:false
    }
    var UserScheema = new userscheema(OTPSchema,version);
    
    var Userotp= mongoose.model("OTP",UserScheema);
    return Userotp;
}

module.exports = {getResetPasswordModal}