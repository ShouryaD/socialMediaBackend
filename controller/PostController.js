let Posts = require('../models/PostSchema')

let createPost = async (req, res) => {
    let { title, description, files } = req.body
    let userId = req.user

    let arr = files.map((file) => {
        let obj = {}
        obj.resource_type = file.data.resource_type,
            obj.url = file.data.secure_url
        return obj
    })

    // console.log(arr)
    try {
        let data = await Posts.create({ title, description, files: arr, userId })
        res.json({ msg: 'Post created successfully', success: true, data })
    } catch (error) {
        res.json({ msg: 'Error creating post', success: false, error: error.message })
    }
}

let updatePost = async (req, res) => {
    let id = req.user
    let postId = req.params._id
    try {
        let post = await Posts.findById(postId)
        //we are using toString() so that the values can match bcs of !==
        // console.log("postId", postId)
        // console.log("userId", id)
        // console.log(post)
        if (post.userId.toString() !== id.toString()) {
            res.json({ msg: 'You can only update your own posts', success: false })
        }
        else {
            let { title, description, image } = req.body
            let data = await Posts.findByIdAndUpdate(postId, { $set: { title, description, image } }, { new: true })
            res.json({ msg: 'Post updated successfully', success: true, data })
        }
    } catch (error) {
        res.json({ msg: 'Error updating post', success: false, error: error.message })
    }
}

let deletePost = async (req, res) => {
    let id = req.user
    let postId = req.params._id
    try {
        let post = await Posts.findById(postId)
        if (post.userId.toString() === id.toString()) {
            await Posts.findByIdAndDelete(postId)
            res.json({ msg: 'Post deleted successfully', success: true })
        }
        else {
            res.json({ msg: 'You can only delete your own posts', success: false })
        }
    }
    catch (error) {
        res.json({ msg: 'Error deleting post', success: false, error: error.message })
    }
}

let getUserPosts = async (req, res) => {
    let id = req.user
    try {
        let data = await Posts.find({ userId: id }).populate({ path: 'userId', select: '-password' }).populate({
            path:'comments',
            populate:{
                path:'userId'
            }
        })
        res.json({ msg: 'Posts retrieved successfully', success: true, data })
    } catch (error) {
        res.json({ msg: 'Error retrieving posts', success: false, error: error.message })
    }
}

let getAllUserPosts = async (req, res) => {
    try {
        let data = await Posts.find().populate({ path: 'userId', select: ['name', 'profilePic'] }).populate({
            path:'comments',
            populate:{
                path:'userId'
            }
        })
        res.json({ msg: 'All posts retrieved successfully', success: true, data })
    } catch (error) {
        res.json({ msg: 'Error retrieving posts', success: false, error: error.message })
    }
}

let getRandomUserPosts = async(req, res)=>{
    let {userId} = req.body
    // console.log('userId',userId)
    try {
        let posts = await Posts.find({userId}).populate({path:'userId', select:'-password'}).populate({
            path:'comments',
            populate:{
                path:'userId',
                select:['name', 'profilePic']
            }
        })
        return res.json({msg:"post fetched successfully", success:true,posts})
    } catch (error) {
        return res.json({msg:"error in getting user post",success:false,error:error.message})
    }
}

const likePost = async (req, res) => {
    const { postId } = req.params
    const userId = req.user
    try {
        const post = await Posts.findById(postId)
        if (post.likes.includes(userId)) {
            post.likes.pull(userId)
            await post.save()
            return res.json({ msg: 'Post unliked successfully', success: true, post })
        }
        else {
            post.likes.push(userId)
            await post.save()
            return res.json({ msg: 'Post liked successfully', success: true, post })
        }
    } catch (error) {
        return res.json({ msg: 'Error liking post', success: false, error: error.message })
    }
}

const commentPost = async (req, res) => {
    const userId = req.user
    const { text } = req.body
    const { postId } = req.params
    try {
        let post = await Posts.findById(postId)
        post.comments.push({ userId, text })
        await post.save()
        return res.json({ msg: 'Comment posted successfully', success: true, post })
    } catch (error) {
        return res.json({ msg: 'Error posting comment', success: false, error: error.message })
    }
}
module.exports = {
    createPost, updatePost, deletePost, getUserPosts, getAllUserPosts,
    likePost, commentPost, getRandomUserPosts
}