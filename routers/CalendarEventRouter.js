var express = require('express')
var EventRouter = express.Router();

var obj = require('../controllers/CalendarEventController');
const {validiatetoken} = require("../config/validate")

EventRouter.post('/dosaveevent',validiatetoken,obj.dosaveevent);
EventRouter.post('/dogetevents',validiatetoken,obj.dogetevents);
EventRouter.post('/dodeleteevent',validiatetoken,obj.dodeleteevent);


module.exports = EventRouter;