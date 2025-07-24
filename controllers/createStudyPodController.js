var {getCreateStudyPodModel} = require('../models/createStudyPodModal');
var path = require("path");
var UserPodref = getCreateStudyPodModel();


function CreateStudyPod(req,resp)
{
    console.log(req.body);
    if (!req.body.GroupIcon || req.body.GroupIcon.trim() === "") {
    req.body.GroupIcon = "https://res.cloudinary.com/db2d9wtzb/image/upload/v1/studysyncAssets/nopic.jpg";
    }
    req.body.members = [req.body.email];
    var userobj = new UserPodref(req.body);
    userobj.save().then((document)=>{
        resp.json({doc:document, status:true, msg: 'Group Created Succesfully'});
    }).catch((err)=>{
        console.log(err.message)
        resp.json({status:false, msg:err.message});
    })
}


function CheckNameAvailibility(req, resp)
{
    console.log(req.query);
    UserPodref.find({GroupName:req.query.GroupName}).then((data)=>{
        if(data.length!=0)
        {
            resp.json({Availibility:false, status:true});
        }
        else{
            resp.json({Availibility:true, status:true});
        }

    }).catch((err)=>{
        resp.json({status:false, msg:err.message});
    })
}
function getallpods(req, resp)
{
    const email = req.user.email;
    console.log("***********");
    console.log(email);
    UserPodref.find({members:email}).then((data)=>{
        resp.json({doc:data,status:true,msg:"All groups found",useremail:email})
    }).catch((err)=>{
        resp.json({status:false, msg:err.message});
    })
}

async function JoinGroup(req,resp)
{
    console.log(req.body);
    const {email, GroupName, PassKey} = req.body;
    const group = await UserPodref.findOne({GroupName});
    if(!group) resp.json({status:false,msg:"Group With This Name Does Not Exist"});
    if(group.PassKey!=PassKey) resp.json({status:false, msg:"Invalid PassKey"});

    if(group.members.includes(email))
    {
        resp.json({status:true,msg:"You are already added in the Group"})
    }
    else{
        group.members.push(email);
        await group.save();
        resp.json({status:true,msg:"Successfully added to the Group"});
    }

}


function FetchGroupDetials(req, resp)
{
    console.log(req.query);
    UserPodref.findById(req.query.groupId).then((group)=>{
        if(!group)
            resp.json({status:false,msg:"Group Not Found"})
        else
            resp.json({group:group,status:true,msg:"Group Found"})
    }).catch((err)=>{
        resp.json({status:false,msg:err.message});
    })
}

async function doleavegroup(req,resp)
{
    const email = req.user.email;
    const groupid = req.params.groupId;
    try{
    const group = await UserPodref.findById(groupid);
    if(!group)
    {
        return resp.json({status:false,msg:"Group not found"});
    }
    if (!group.members.includes(email)) {
      return resp.json({ status: false, msg: "You are not a member of this group" });
    }

    if (group.members.length === 1) {
      await UserPodref.deleteOne({ _id: groupid });
    } else {
      group.members = group.members.filter(em => em !== email);
      await group.save();
    }

    return resp.json({ status: true, msg: "Successfully left the group" });

    }catch(err)
    {
        resp.json({status:false, msg:err.message});
    }
    
}
module.exports = {CreateStudyPod, CheckNameAvailibility, getallpods, JoinGroup, FetchGroupDetials, doleavegroup}

