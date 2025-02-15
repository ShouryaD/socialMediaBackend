let mongoose = require('mongoose')

let PostSchema = new mongoose.Schema({
    title: String,
    description: {
        type: String
    },
    files: [],
    // image:{
    //     type:String
    // },
    // video:{
    //     type:String
    // },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

PostSchema.add({
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
    ]
})

module.exports = mongoose.model('Posts', PostSchema)