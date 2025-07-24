var {getCalendarEventModel} = require('../models/CalendarEventModal');
var path = require("path");
var Usereventref = getCalendarEventModel();


async function dosaveevent(req,resp)
{
  
    let obj = {
        email:req.user.email,
        date:req.body.date,
        title:req.body.title,
        time:req.body.time
    }
      var eventobj = new Usereventref(obj);
      eventobj.save().then((document)=>{
          resp.json({doc:document, status:true, msg: 'Event Saved Successfully'});
      }).catch((err)=>{
          console.log(err.message)
          resp.json({status:false, msg:err.message});
      })
}


async function dogetevents(req,resp)
{
    try {
    const email = req.user.email;
    const allevents = await Usereventref.find({ email });
    resp.json({events:allevents,status:true,msg:'Events found'});
  } catch (err) {
    resp.json({status:false,msg:err.message});
  }
}


async function dodeleteevent(req,resp)
{
  const { date, title, time } = req.body;
  const email = req.user.email; 

  try {
    const result = await Usereventref.deleteOne({ email, date, title, time });
    if (result.deletedCount === 1) {
      resp.json({ status: true, msg: 'Event deleted successfully.' });
    } else {
      resp.json({ status: false, msg: 'Event not found or already deleted.' });
    }
  } catch (err) {
    console.error(err);
    resp.json({ status: false, msg: err.message });
  }
}





module.exports = {dosaveevent,dogetevents,dodeleteevent}

