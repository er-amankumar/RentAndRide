const mongoose = require('mongoose')


const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    otp:{
        type:String,
        required:true,
        unique:true
    },
    otpExpired:{
        type:Date

    }
})
module.exports = mongoose.model('OTP',otpSchema)