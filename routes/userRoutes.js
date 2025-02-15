const express = require('express')
const { loginUser, updateUser, deleteUser, register, getUserDetails, forgotPassword, getTokenMail, finalResetPassword, searchUser, getUserById, followUser } = require('../controller/UserController')
const checkToken = require('../middlewares/checkToken')
const router = express.Router()


router.post('/register', register)
router.post('/login', loginUser)
router.put('/update/:_id', checkToken, updateUser)
router.delete('/delete/:_id', checkToken, deleteUser)
router.get('/getInfo', checkToken, getUserDetails)
router.post('/forgot-password', forgotPassword)
router.get('/resetToken/:token', getTokenMail)
router.post('/resetToken/:token', finalResetPassword)
router.get('/search', searchUser)
router.get('/getUserById/:userId', getUserById)
router.post('/follow/:friendId', checkToken, followUser)
module.exports = router