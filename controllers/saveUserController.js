var {getUserModal} = require('../models/userModal');
var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var Userref = getUserModal();
var {getResetPasswordModal} = require('../models/ResetPasswordModal');
const nodemailer = require("nodemailer");
var Userotp = getResetPasswordModal();


const SALT_ROUNDS = 10;

async function saveUser(req,resp)
{
    console.log("---------------------")
    console.log(req.body);
    var {name, email, password} = req.body;

    const hashpassword = await bcrypt.hash(password,SALT_ROUNDS);
    var obj={
      name:name,
      email:email,
      password:hashpassword
    }
    var Userobj = new Userref(obj);
    Userobj.save().then((data)=>{
        resp.json({doc:data,status:true,msg:"Registered Successfully, Please LogIn"});
    }).catch((err)=>{
        if (err.code === 11000) {
        resp.json({ status: false, msg: "Email already registered." });
      } else {
        resp.json({ status: false, msg: err.message });
      }
    })

}

async function loginUser(req, resp) {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const data = await Userref.findOne({ email });

    if (!data) {
      return resp.json({ status: false, msg: "Email not registered." });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return resp.json({ status: false, msg: "Invalid password. Please try again." });
    }

    const payload = {
      id: data._id,
      email: data.email,
      name: data.name
    };

    const jtoken = jwt.sign(payload, process.env.SEC_KEY, { expiresIn: '10m' });

    return resp.json({ doc: data, status: true, msg: "Login Successfully" ,token:jtoken});

  } catch (err) {
    return resp.json({ status: false, msg: err.message });
  }
}

async function dochangepassword(req,resp) {
  const email = req.user.email;
  const { currentPassword, newPassword, confirmNewPassword} = req.body
  try{
    const data = await Userref.findOne({email})
     if (!data) {
      return resp.json({ status: false, msg: "Email not registered." });
    }
    const isMatch = await bcrypt.compare(currentPassword, data.password);
     if (!isMatch) {
      return resp.json({ status: false, msg: "Current Password is Invalid" });
    }
    const hashpassword = await bcrypt.hash(newPassword,SALT_ROUNDS);
    data.password = hashpassword;
    await data.save();

    resp.json({status:true,msg:"Password Changes Successfully"});


    }catch(err)
  {
    return resp.status(500).json({ status: false, msg: err.message });
  }
  
}




function generateOTP()
{
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendotp(req,resp)
{
    console.log(req.query.email);
    const uemail = req.query.email;

    if (!uemail) return resp.json({ success: false, message: "Email is required" });
    try{
    const data = await Userref.findOne({ email:uemail });

    if (!data) {
      return resp.json({ status: false, msg: "Email not registered." });
    }
    
    const otpp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log(otpp);
    console.log(expiresAt)

    const obj={
      email:uemail,
      otp:otpp,
      otpExpires:expiresAt
    }
    const otpobj =new  Userotp(obj);
    await otpobj.save()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adityajindalbti21@gmail.com",
        pass: "aeprwbbyxlsuagvb",
      }
    });

    const mailOptions = {
      from: "adityajindalbti21@gmail.com",
      to: uemail,
      subject: "Your OTP for password reset",
      html: `<p>Your OTP is <b>${otpp}</b>. It expires in 10 minutes.</p>`
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email Sent");
    resp.json({status:true,msg:"OTP Sent Successfully"});
  }catch(err)
  {
    console.log(err.message);
    resp.json({status:false,msg:err.message});
  }

}

async function verifyotp(req,resp) {
 const { email, otp } = req.query;

  if (!email || !otp) {
    return resp.json({ status: false, msg: "Email and OTP are required." });
  }

   try {
    const record = await Userotp.findOne({ email });

    if (!record) {
      return resp.json({ status: false, msg: "No OTP found for this email." });
    }

    if (record.otpExpires < new Date()) {
      return resp.json({ status: false, msg: "OTP has expired." });
    }

    if (record.otp !== otp) {
      return resp.json({ status: false, msg: "Invalid OTP." });
    }

    await Userotp.deleteOne({ email });

    return resp.json({ status: true, msg: "OTP verified successfully. You may now reset your password." });

  } catch (err) {
    console.error(err.message);
    return resp.status(500).json({ status: false, msg: err.message });
  }


  
}

async function doresetpassword(req,resp)
{
    const {email , newPassword , confirmNewPassword} = req.body;
     try{
    const data = await Userref.findOne({email})
     if (!data) {
      return resp.json({ status: false, msg: "Email not registered." });
    }
    const hashpassword = await bcrypt.hash(newPassword,SALT_ROUNDS);
    data.password = hashpassword;
    await data.save();

    resp.json({status:true,msg:"Password Changes Successfully"});


    }catch(err)
  {
    return resp.status(500).json({ status: false, msg: err.message });
  }

}



module.exports = {saveUser,loginUser,dochangepassword,sendotp,verifyotp,doresetpassword}