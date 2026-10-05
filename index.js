const express = require('express')
const dotenv = require('dotenv')
const db_coection = require('./config/db_connection')
const cookieParser = require('cookie-parser')
//const route = require('./routes/route')
const router = require('./routes/OTP')

dotenv.config()

const app = express()
const port = process.env.port


// built in middleware
app.set("view engine","ejs")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
//app.use('/',route)
app.use('/',router)
app.use(express.static("static"))


app.listen(port ,()=>{
    console.log("server started at 5000 port")
})

