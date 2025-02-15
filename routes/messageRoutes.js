const express = require('express');
const { sendMessage, deleteMessage, getMessage } = require('../controller/MessageController');
const checkToken = require('../middlewares/checkToken');
const router = express.Router();

router.post('/create', checkToken, sendMessage)
router.get('/getMessage/:recieverId', checkToken, getMessage)
router.delete('/deleteMessage/:_id', deleteMessage)


module.exports = router