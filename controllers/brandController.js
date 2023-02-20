const Brand = require("../models/brandModel")
const asyncHandler = require("express-async-handler")
const validateMongodbid = require("../utils/validateMongodbid");


const createBrand = asyncHandler(async(req,res)=>{
    try{
    const newBrand = await Brand.create(req.body)
    res.json(newBrand)

    }catch(err){
        throw new Error(err)
    }
})

const updateBrand = asyncHandler(async(req,res)=>{
   const {id} = req.params
   validateMongodbid(id)
    try{
    const updatedBrand = await Brand.findByIdAndUpdate(id,req.body,{
        new:true
    })
    res.json(updatedBrand)

    }catch(err){
        throw new Error(err)
    }
})

const deleteBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbid(id)
     try{
     const deletedBrand = await Brand.findByIdAndDelete(id)
     res.json(deletedBrand)
 
     }catch(err){
         throw new Error(err)
     }
 })
 const getBrandById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbid(id)
     try{
     const getaBrand = await Brand.findById(id)
     res.json(getaBrand)
 
     }catch(err){
         throw new Error(err)
     }
 })

 const getAllBrand = asyncHandler(async(req,res)=>{
     try{
     const getallBrand = await Brand.find()
     res.json(getallBrand)
 
     }catch(err){
         throw new Error(err)
     }
 })

module.exports = {
    createBrand,updateBrand,
    deleteBrand,getBrandById,
    getAllBrand
}