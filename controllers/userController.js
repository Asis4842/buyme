const User = require("../models/userModel")
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongodbid = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshToken");
const { find } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController");
const crypto = require("crypto")

const createUser =asyncHandler( async(req,res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email})
    if(!findUser){
        //create new user
        const newUser =await User.create(req.body)
        res.json(newUser)
    }else{
        //user existed already
       throw new Error("User already existed")
    }
})

const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body

    const findUser = await User.findOne({email})
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findUser?._id)
       const updateuser = await User.findByIdAndUpdate(findUser?.id,{
        refreshToken:refreshToken
       },{
        new:true
       })
       res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        maxAge:72*60*60*1000
       })
        res.json({
        _id:findUser?._id,
        firstname:findUser?.firstname,
        lastname:findUser?.lastname,
        email:findUser?.email,
        mobile:findUser?.mobile,
        token:generateToken(findUser?._id)
       })
    }else{
        throw new Error("Invalid credentials")
    }
})

//admin user login
const loginAdmin = asyncHandler(async (req,res)=>{
    const {email,password} = req.body

    const findAdmin = await User.findOne({email})
    if(findAdmin.role !== 'admin') throw new Error("Not Authorized")
    if(findAdmin && await findAdmin.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findAdmin?._id)
       const updateuser = await User.findByIdAndUpdate(findAdmin?.id,{
        refreshToken:refreshToken
       },{
        new:true
       })
       res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        maxAge:72*60*60*1000
       })
        res.json({
        _id:findAdmin?._id,
        firstname:findAdmin?.firstname,
        lastname:findAdmin?.lastname,
        email:findAdmin?.email,
        mobile:findAdmin?.mobile,
        token:generateToken(findAdmin?._id)
       })
    }else{
        throw new Error("Invalid credentials")
    }
})

const handleRefreshToken = asyncHandler(async (req,res)=>{
const cookie = req.cookies
if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
const refreshToken = cookie.refreshToken
const user = await User.findOne({refreshToken})
if(!user) throw new Error("No Refresh token present in DB")
jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
    if(err || user.id!==decoded.id){
        throw new Error("There is something wrong with refresh token")
    }
    const accessToken = generateToken(user?.id)
    res.json({accessToken})
})
})

const logout= asyncHandler(async (req,res)=>{
    const cookie = req.cookies
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
const refreshToken = cookie.refreshToken
const user = await User.findOne({refreshToken})
if(!user){
    res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:true
    })
    return res.sendStatus(204)
}
await User.findOneAndUpdate(refreshToken,{
    refreshToken:""
})
res.clearCookie('refreshToken',{
    httpOnly:true,
    secure:true
})
return res.sendStatus(204)

})

const getAllUser = asyncHandler(async (req,res)=>{
    try{
    const getUsers = await User.find()
    res.json(getUsers)
    }catch(err){
        throw new Error(err)
    }
})

const getaUser = asyncHandler(async (req,res)=>{
  const {id} = req.params
  validateMongodbid(id)
    try{
    const getUser = await User.findById(id)
    res.json(getUser)
    }catch(err){
        throw new Error(err)
    }
})

const deleteUser = asyncHandler(async (req,res)=>{
    const {id} = req.params
    validateMongodbid(id)
      try{
      const deletedUser = await User.findByIdAndDelete(id)
      res.json({
        message:"User deleted successfully",
        deletedUser
      })
      }catch(err){
          throw new Error(err)
      }
  })

  const updateUser = asyncHandler(async (req,res)=>{
    const {_id} = req.user
    validateMongodbid(_id)
      try{
      const updatedUser = await User.findByIdAndUpdate(_id,{
        firstname:req?.body?.firstname,
        lastname:req?.body?.lastname,
        email:req?.body?.email,
        mobile:req?.body?.mobile
      },{
        new:true
      })
      res.json({
        message:"User updated successfully",
        updatedUser
      })
      }catch(err){
          throw new Error(err)
      }
  })

  const blockUser = asyncHandler(async(req,res)=>{
    const {id} =req.params
    validateMongodbid(id)
    try{
        const block =await User.findByIdAndUpdate(id,{
            isBlocked:true
        },{
            new:true
        })

        res.json({
            message:"User Blocked Successfully."
        })

    }catch(err){
        throw new Error(err)
    }
  })

  const unBlockUser = asyncHandler(async(req,res)=>{
    const {id} =req.params
    validateMongodbid(id)
    try{
        const unBlock =await User.findByIdAndUpdate(id,{
            isBlocked:false
        },{
            new:true
        })
        res.json({
            message:"User UnBlocked Successfully."
        })

    }catch(err){
        throw new Error(err)
    }
  })

  const updatePassword = asyncHandler(async (req,res)=>{
    const {_id} = req.user
    const {password} = req.body
    validateMongodbid(_id)
    const user = await User.findById(_id)

    if(password){
        user.password=password
        const updatedPassword = await user.save()
        res.json(updatedPassword)
    }else{
        res.json(user)
    }
  
  })


  const forgotPasswordToken = asyncHandler(async (req,res)=>{
  const {email} = req.body
 const user = await User.findOne({email})

 if(!user) throw new Error("User not found with this email")

 try{
    const token = await user.createPasswordResetToken()
    await user.save()

    const resetURL = `Hi Please follow this link to reset Your Password.This link is valid till 10 minutes from now.
     <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`

     const data = {
        to:email,
        text:"Hey user",
        subject:"Forgot Password Link",
        html:resetURL,
     }
     sendEmail(data)
     res.json(token)

 }catch(err){
    throw new Error(err)
 }


  })

  const resetPassword = asyncHandler(async(req,res)=>{
    const {password} = req.body
    const {token} = req.params
 const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
 const user = await User.findOne({passwordResetToken:hashedToken,
passwordResetExpires:{$gt:Date.now()}
})

if(!user) throw new Error("Token Expired. Please try again later")

user.password=password
user.passwordResetToken=undefined
user.passwordResetExpires=undefined
await user.save()

res.json(user)

  })

  const getWishlist = asyncHandler(async(req,res)=>{
const {_id} = req.user;

    try{
        const findUser = await User.findById(_id).populate('wishlist')
        res.json(findUser)


    }catch(err){
        throw new Error(err)
    }
  })

  const saveAddress = asyncHandler(async(req,res,next)=>{
    const {_id} = req.user
    validateMongodbid(_id)
      try{
      const userAddress = await User.findByIdAndUpdate(_id,{
        address:req?.body?.address,
      },{
        new:true
      })
      res.json({
        message:"User address added successfully",
        userAddress
      })
      }catch(err){
          throw new Error(err)
      }
  })


module.exports = { createUser,loginUser,
    getAllUser,getaUser,
    deleteUser,updateUser,
    unBlockUser,blockUser,
    handleRefreshToken,logout,
    updatePassword,forgotPasswordToken,resetPassword,
    loginAdmin,getWishlist,
    saveAddress

}