var express = require('express')
var ContentRouter = express.Router();

var obj = require('../controllers/MarkdownController');
const {validiatetoken} = require("../config/validate");

ContentRouter.post('/dosavecontent',obj.dosavecontent);
ContentRouter.get('/getcontent/:groupId',obj.getcontent);
module.exports = ContentRouter;