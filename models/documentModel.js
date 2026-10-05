
const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        reuired:true
    },
    rcFile: {
    url: String,
    public_id: String,
    verified: {
        type: Boolean,
        default: false
    },
    uploadedAt: Date
},

insuranceFile: {
    url: String,
    public_id: String,
    verified: {
        type: Boolean,
        default: false
    },
    expiryDate: Date,
    uploadedAt: Date
}
})

module.exports = mongoose.model("File",fileSchema)