var jwt  = require("jsonwebtoken");
function validiatetoken(req,resp,next)
{
   const full_token = req.headers['authorization'];
   if (!full_token || !full_token.startsWith("Bearer ")) {
    return resp.status(401).json({ status: false, msg: "Token missing or invalid format" });
  }

   console.log(full_token);
   var ary = full_token.split(" ");
   let actualtoken = ary[1];
   let istokenvalid;
   console.log("**********************************");

   try{
    istokenvalid = jwt.verify(actualtoken,process.env.SEC_KEY);
    console.log(istokenvalid);
    if(istokenvalid!=null)
    {
        const payload = jwt.decode(ary[1]);
        console.log("****************************");
        console.log(payload)
        req.user = payload;
        next();
    }
    else
    {
        resp.json({status:false,msg:"not autho"})
    }
   }catch(err)
   {
        resp.json({status:false,msg:err.message});
        return;
   }
}

module.exports={validiatetoken};