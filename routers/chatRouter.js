const express = require('express');
const ChatRouter = express.Router();
const obj = require('../controllers/chatController');


ChatRouter.get('/:groupId', obj.getMessagesByGroup);
ChatRouter.post('/send', obj.saveMessage);


module.exports = ChatRouter;

