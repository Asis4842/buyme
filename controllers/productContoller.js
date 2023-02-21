const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")
const User = require("../models/userModel")
const validateMongodbid = require("../utils/validateMongodbid")
const cloudinaryUploadImg = require("../utils/cloudinary")
const fs = require("fs")

const createProduct = asyncHandler(async(req,res)=>{
    try{
      if(req.body.title){
        req.body.slug=slugify(req.body.title)
      }

        const newProduct = await Product.create(req.body)
        res.json(newProduct)

    }catch(err){
        throw new Error(err)
    }
})

const updateProduct = asyncHandler(async(req,res)=>{
    const id = req.params
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }

        const updateProduct = await Product.findOneAndUpdate({id},req.body,{
new:true
        })
        res.json(updateProduct)

    }catch(err){
        throw new err(err)
    }
})

const deleteProduct = asyncHandler(async(req,res)=>{
    const id = req.params
    try{
       

        const deletedProduct = await Product.findByIdAndDelete(id)
        res.json(deletedProduct)

    }catch(err){
        throw new err(err)
    }
})

const getProductById = asyncHandler(async (req,res)=>{
   const {id} = req.params
    try{
        const findProduct = await Product.findById(id)
        res.json(findProduct)
       
    }catch(err){
        throw new Error(err)
    }

})

const getAllProduct = asyncHandler(async (req,res)=>{
    try{
        //Filter
    const queryObject = {...req.query}
 const excludeFields = ["page","sort","limit","fields"]
 excludeFields.forEach(el=>delete queryObject[el])

 let queryString = JSON.stringify(queryObject)
 queryString=queryString.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
    
let query = Product.find(JSON.parse(queryString))


//Sorting
 if(req.query.sort){
    const sortBy =req.query.sort.split(',').join(" ")
    query = query.sort(sortBy)
 }else{
    query = query.sort('-createdAt')
 }



 //Limiting the fields
 if(req.query.fields){
    const fields =req.query.fields.split(',').join(" ")
    query= query.select(fields)
 }else{
    query= query.select("__v")

 }


 //Pagination start page by 1 only
 const page = req.query.page;
 const limit = req.query.limit;
 const skip = (page-1)*limit;
query = query.skip(skip).limit(limit)
if(req.query.page){
    const productCount = await Product.countDocuments();
    if(skip>=productCount) throw new Error("This page does not exists")
}



         const findProducts = await query
         res.json(findProducts)
        
     }catch(err){
         throw new Error(err)
     }
 
 })

 const addToWishlist = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {prodId} = req.body;
    try{
        const user =await User.findById(_id)
        const alreadyAdded = user.wishlist?.find((id)=>id.toString()===prodId.toString())
    if(alreadyAdded){
        let user = await User.findByIdAndUpdate(_id,{
            $pull:{wishlist:prodId}
        },{
            new:true
        })
        res.json(user)

    }else{
        let user = await User.findByIdAndUpdate(_id,{
            $push:{wishlist:prodId}
        },{
            new:true
        })
        res.json(user)
    }

    }catch(err){
        throw new Error(err)
    }

 })


 const rating = asyncHandler(async(req,res)=>{
    const {_id} =req.user
    const {star,prodId} = req.body
    try{
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find((userId)=>userId.postedBy.toString()=== _id.toString())
    if(alreadyRated){
        const updateRating = await Product.updateOne({
            ratings:{$eleMatch:alreadyRated}
        },
            {
                $set:{'ratings.$.star':star }
            },
            {
                new:true
            }
        )

       // res.json(updateRating)

    }else{
        const rateProduct = await Product.findByIdAndUpdate(prodId,{
            $push:{
                star:star,
                postedBy:_id
            }
        },{new:true})

        // res.json(rateProduct)

    }


    const getAllRatings = await Product.findById(prodId)
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings.map((item)=>item.star).reduce((prev,curr)=>prev+curr,0)
    let actualRating = Math.round(ratingSum/totalRating)
   let finalProduct = await Product.findByIdAndUpdate(prodId,{
        totalRating:actualRating
    },{
        new:true
    })

    res.json(finalProduct)
}catch(err){
    throw new Error(err)
}
 })

 const uploadImages = asyncHandler(async(req,res)=>{
const {id} = req.params
validateMongodbid(id)

try{
    const uploader =(path)=>cloudinaryUploadImg(path,"images")
    const urls = []
    const files = req.files
    for(const file of files){
        const {path} = file;
        const newPath = await uploader(path)
        urls.push(newPath)
       fs.unlinkSync(path) 
    }

    const findProduct = await Product.findByIdAndUpdate(id,{
        images:urls.map(file=>{
            return file
        })
    },{
        new:true
    })

    res.json(findProduct)

}catch(err){
    throw new Error(err)
}
 })


module.exports={
    createProduct,getProductById,
    getAllProduct,updateProduct,
    deleteProduct,addToWishlist,
    rating,uploadImages

}