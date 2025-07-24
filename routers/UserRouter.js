var express = require('express');
var UserRouter = express.Router();

var obj = require('../controllers/saveUserController');
const {validiatetoken} = require("../config/validate")

UserRouter.post('/registeruser',obj.saveUser);
UserRouter.post('/loginuser',obj.loginUser);
UserRouter.post('/dochangepassword',validiatetoken,obj.dochangepassword);
UserRouter.get('/sendotp',obj.sendotp);
UserRouter.get('/verifyotp',obj.verifyotp);
UserRouter.post('/doresetpassword',obj.doresetpassword);


module.exports = UserRouter;