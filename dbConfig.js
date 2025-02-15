const mongoose = require('mongoose')
require('dotenv').config()
console.log(process.env.db)
let connection = ()=>{
    mongoose.connect(process.env.db)
    .then(()=>console.log('Connected to MongoDB'))
    .catch((err)=>console.log(err))
}

module.exports = connection