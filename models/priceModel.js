const mongoose = require('mongoose')


const PriceModelSchema = new mongoose.Schema({
    priceid : {
        type:String,
        required:true,
        unique:true
    },
    brand:{
        type:String,
        required:true
    },
    model : {
        type:String,
        unique:true,
        required:true
    },
    daily_price :{
        type:String,
        required:true
    },
    hourly_price :{
        type:String,
        required:true
    },
    deposit_amount:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
         
    },
     
})

module.exports = mongoose.model("PriceModel",PriceModelSchema)