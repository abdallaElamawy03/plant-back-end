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
        post_date: {
            type: Date,
            default: Date.now
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
                default:Date.now
            }
            
        }]

        
    })
    module.exports=mongoose.model('Post',postSchema)