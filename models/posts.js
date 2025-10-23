const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    title : {
        type:String,
        required:true,

    },
    post_date:{
        type:Date,
        default:new Date()
    },
    comments:[{
        user : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
        text:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            default:new Date()
        }
        
    }]

    
})
module.exports=mongoose.model('Post',postSchema)