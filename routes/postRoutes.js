let express = require('express')
const { createPost, updatePost, deletePost, getAllUserPosts, getUserPosts, likePost, commentPost, getRandomUserPosts } = require('../controller/PostController')
const checkToken = require('../middlewares/checkToken')
let router = express.Router()

router.post('/create', checkToken, createPost)
router.put('/update/:_id', checkToken, updatePost)
router.delete('/delete/:_id', checkToken, deletePost)
router.get('/getUserPost', checkToken, getUserPosts)
router.post('/getRandomUserPost', getRandomUserPosts)
router.get('/getAll', getAllUserPosts)
router.post('/like/:postId',checkToken, likePost)
router.post('/comment/:postId', checkToken,commentPost)

module.exports = router