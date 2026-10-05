const mongoose = require('mongoose')


const vehicleSchema = new mongoose.Schema({
    ownerId : {     // foreign key
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    rcNo:{
        type:String,   // primary key
        required:true,
        unique:true
    },
   model:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
        
    },
     
    rcfile : {
         url:String,
         publicKey:String,
         verified:{
            type:Boolean,
            default:false
         }
    },
    insuranceFile : {
         file:{
            url:String,
            publicKey:String
            },

         insuranceExpiry:Date,
         insuranceNumber:String,
         verified:{
            type:Boolean,
            default:false
         }
    },
    pollutionCertificate : {
         file:{
            url:String,
         publicKey:String,
        },
         verified:{
            type:Boolean,
            default:false
         }
    },
    vehicleType:{
        type: String,
        enum : ['car','bike'],
        default:'bike'
    },
     
    year: String,
    color:String,
    fuelType:{
        type: String,
        enum : ['petrol','diesel','electric'],
        default:'petrol'
    },
     seats:Number,
     location: String,
     vehicleImg : {           // vehicle image
         url:String,
         publicKey:String,
          
    },

    isAvailable:{
        type:Boolean,
        default:false
    },
    approval_status:{
        type:Boolean,
        default:false
    },
    created_at:{
        type:Date,
        default:Date.now
         
    }
})

module.exports = mongoose.model("Vehicles",vehicleSchema)
