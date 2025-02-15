const mongoose = require('mongoose')

let connection = ()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/twitterApp')
    .then(()=>console.log('Connected to MongoDB'))
    .catch((err)=>console.log(err))
}

module.exports = connection