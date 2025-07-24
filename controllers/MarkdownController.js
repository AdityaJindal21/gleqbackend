var {getMarkdownModel} = require('../models/MakrdownModel');
var path = require("path");
var UserContentref = getMarkdownModel();

async function dosavecontent(req, resp) {
    try {
        const Notes = await UserContentref.findOne({ groupId: req.body.groupId });

        if (!Notes) {
            const userObj = new UserContentref(req.body);
            const savedDoc = await userObj.save();
            return resp.json({ doc: savedDoc, status: true, msg: 'Notes Saved Successfully' });
        } else {
            
            Notes.content = req.body.content;
            const updatedDoc = await Notes.save();
            return resp.json({ doc: updatedDoc, status: true, msg: 'Notes Updated Successfully' });
        }
    } catch (err) {
        console.error("Error saving notes:", err.message);
        return resp.json({ status: false, msg: err.message });
    }
}
async function getcontent(req,resp)
{
     try {
        const notes = await UserContentref.findOne({ groupId: req.params.groupId });

        if (!notes) {
            return resp.json({ status: false, msg: "No notes found" });
        }

        return resp.json({ status: true, content: notes.content });
    } catch (err) {
        console.error(err.message);
        resp.json({ status: false, msg: err.message });
    }
}


module.exports = {dosavecontent,getcontent}

