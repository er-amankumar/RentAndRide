const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true,
        trim:true
    },
    role:{
        type: String,
        enum : ['admin','user','carOwner'],
        default:'user'
    },
    emailVerified:{
        type:Boolean,
        default:false
    },
    // phone:{
    //     type:String,
    //     unique:true,
    //     verified:{
    //         type:Boolean,
    //         default:false
    //     }
    // },
    
    profileImage:{
        url:String,
        publicKey:String
    },
    phone:{
        number:{
            type:Number
        },
        verified:{
            type:Boolean,
            default:false
        }
    },
    drivingLicense:{
        file:{
            url:String,
            publicKey:String
        },
        verified:{
            type:Boolean,
            default:false
        }
    },
    status:{
        type:String,
        enum:['active','blocked'],
        default:"active"
    },
    created_at:{
        type:Date,
        default:Date.now
         
    }
})

module.exports = mongoose.model("User",UserSchema)