var express = require('express')
var StudyPodRouter = express.Router();

var obj = require('../controllers/createStudyPodController');
const {validiatetoken} = require("../config/validate")
StudyPodRouter.post('/create-study-pod',obj.CreateStudyPod);
StudyPodRouter.get('/CheckNameAvailibility',obj.CheckNameAvailibility);
StudyPodRouter.post('/getallpods',validiatetoken,obj.getallpods);
StudyPodRouter.post('/join-group',obj.JoinGroup);
StudyPodRouter.get('/get-group',obj.FetchGroupDetials);
StudyPodRouter.post('/leavegroup/:groupId',validiatetoken,obj.doleavegroup);

module.exports = StudyPodRouter;