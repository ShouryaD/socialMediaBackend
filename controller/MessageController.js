const Message = require('../models/MessageModel')
const Conversation = require('../models/ConversationModel')
const sendMessage = async (req, res) => {
    const { recieverId, message } = req.body
    let senderId = req.user

    let conversation = await Conversation.findOne({ members: { $all: [senderId, recieverId] } })
    // console.log(conversation)

    if (!conversation) {
        conversation = await Conversation.create({
            members: [senderId, recieverId],
        })
    }

    try {
        let data = await Message.create({
            recieverId,
            senderId,
            message
        })

        conversation.messages.push(data._id)
        await conversation.save()
        res.json({ msg: "msg sent successfully", success: true })
    } catch (error) {
        res.json({ msg: "error in sending message", success: false, error: error.message })
    }
}
const getMessage = async (req, res) => {

    try {
        // const { recieverId } = req.body
        const recieverId = req.params.recieverId
        let senderId = req.user

        let conversation = await Conversation.findOne({ members: { $all: [senderId, recieverId] } }).populate({path:'members', select:['name', 'profilePic']}).populate("messages").select('text')

        if(conversation){
            res.json({ msg: "get successfully", success: true, messages: conversation })
        }
        else{
            res.json({ msg: "get successfully", success: false, messages: [] })
        }

    } catch (error) {
        res.json({ msg: "error in getting message", success: false, error: error.message })
    }
}
const deleteMessage = () => {

}

module.exports = {
    sendMessage,
    getMessage,
    deleteMessage
}


