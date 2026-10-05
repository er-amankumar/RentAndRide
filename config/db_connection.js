const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const dburl = process.env.MONGO_URL
const db_coection =  mongoose.connect(dburl).then(()=>{
    console.log("Database connected successfully")
})
module.exports = db_coection