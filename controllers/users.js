const User = require('../models/User')
const asyncHandler = require('express-async-handler')// keep us from using try and catch alot 
const jwt = require("jsonwebtoken")
const Post = require('../models/posts')

const bcrypt = require('bcrypt')
//@desc get all users 
//@route get/users
//@access Private
//Admin access
const getallUsers = asyncHandler(async (req, res) => {
  // ✅ Use the user and roles from the verified token
  const username = req.user;
  const roles = req.roles;



  if (!username) {
    return res.status(400).json({ message: 'User not found in token' });
  }

  // ✅ Check if the authenticated user has admin privileges
  if (!roles?.includes('admin')) {
    return res.status(403).json({ message: 'Unauthorized - Admin access only' });
  }

  // ✅ Fetch all users
  const users = await User.find().select('-password').lean();

  if (!users?.length) {
    return res.status(404).json({ message: 'No users found' });
  }

  res.json(users);
});


//@desc Create new user
//@route Post/users
//@access Public

const createNewUser =asyncHandler (async (req,res)=>{
    const{username,password,roles}=req.body
    // Confirm data 
    if(!username || !password  ){
        return res.status(400).json({message:"all fields are required "})

    } 

    //Check for duplicates 
    const duplicate = await User.findOne({username}).collation({locale:'en',strength:2}).lean().exec()

    //exec is to execute the query , Better Queery Execution 
    if(duplicate){
        return res.status(409).json({message:"Duplicate username"})

    }
    const hashPwd = await bcrypt.hash(password,10) // 10 is the salting 
    const userObject = (!Array.isArray(roles)||!roles.length)?{username,"password":hashPwd}:{username,"password":hashPwd,roles}

    //Create and store the new user 
    const user = await User.create(userObject)

    if(!user){
         res.status(400).json({message:`new user ${username} created`})

    }
    const accessToken = jwt.sign(
        {
            "UserInfo":{
                "username":username,
                "roles":roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,{expiresIn:'60m'}
    )
    const refreshToken=jwt.sign(
        {"username":username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'1d'}
    
    )
    res.cookie('jwt',refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:'None',
        maxAge:7*24*60*60*1000
    })
    res.json({accessToken})
    


})
//@desc Update a user
//@route PATCH/users
//@access Private
// only user
const updateuser =asyncHandler (async (req,res)=>{
    const{username,roles,active,password}=req.body 
    const{id}= req.params

    // Confirm data 
    if(!id || !username ){
        return res.status(400).json({message:"All field are required"})
    }
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
    //Check for duplicate 
    const duplicate = await User.findOne({username}).collation({locale:'en',strength:2}).lean().exec()
    // Allow updates to the original user permission to the owned user 
    if(duplicate && duplicate?._id.toString()!==id){
        return res.status(409).json({message:"Duplicate username"})

    }
    user.username=username
    user.roles=roles
    user.active=active
    if(password){
        //Hashpassword
        user.password=await bcrypt.hash(password,10)//salt rounds

    }
    const updatedUser=await user.save()
    res.json({message:`${updatedUser.username} updated `})
})
const getUser  = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the user ID from the request parameters

    // Find the user by ID and exclude the password field from the result
    const user = await User.findById(id).select("-password").exec();

    // Check if the user was found
    if (!user) {
        return res.status(404).json({ message: "User  not found" }); // Return 404 if user is not found
    }

    // Return the user data
    res.json({ user });
});
//@desc Delete a user
//@route Delete/users
//@access Private
// Admin and user 
const deleteUser = asyncHandler(async (req, res) => {
    const username = req.user
    const roles = req.roles
    const { id } = req.body

    if (!username) {
    return res.status(400).json({ message: 'User not found in token' });
  }

  // ✅ Check if the authenticated user has admin privileges
  if (!roles?.includes('admin')) {
    return res.status(403).json({ message: 'Unauthorized - Admin access only' });
  }

    // Does the user still have assigned posts?
    const post = await Post.find({ user: id }).lean().exec()
    if (post) {
        const deleted = await Post.deleteMany({user:id}) // edit this line of code
        //confirm the deleting 
        if(!deleted){
            return res.status(400).json({message:"the posts can't be deleted "})
        }
        
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()
    //confirming the user is find
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()
    //confirm that the result is success
    if(result){
      
        return res.status(201).json({message:`the user ${user.username} with id ${user.id} has been deleted successfully`})
    }else{
        return res.status(409).json({message:"There is a conflict"})
    }
    
})

module.exports = {
    getallUsers,
    createNewUser,
    updateuser,
    deleteUser,getUser
}
