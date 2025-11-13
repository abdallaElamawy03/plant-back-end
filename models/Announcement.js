const mongoose = require("mongoose");
const announceSchema = new mongoose.Schema({
 user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
 announcedate:{
    type:Date,
    default:Date.now
 },
 text:{
    type:String,
    default:'default text (smart agri)'

 },



})
module.exports = mongoose.model("announce", announceSchema);
