const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()
const transporter = nodemailer.createTransport({
    service:"gmail",
   // host: "smtp.gmail.com",
    //port: 465,
    //secure: true,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

module.exports = transporter