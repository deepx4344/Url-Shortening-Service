const mongoose = require("mongoose");
const urlSchema = mongoose.Schema(
    {
       url:{
        type:String,
        required:true,
        unique:true
       },
       shortUrl:{
        type:String,
        unique:true
       }
    },
    {
        timestamps: true,
    }
)
const urls = mongoose.model("url",urlSchema);
module.exports = urls