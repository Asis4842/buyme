const Category = require("../models/categoryModel")
const asyncHandler = require("express-async-handler")
const validateMongodbid = require("../utils/validateMongodbid");


const createCategory = asyncHandler(async(req,res)=>{
    try{
    const newCategory = await Category.create(req.body)
    res.json(newCategory)

    }catch(err){
        throw new Error(err)
    }
})

const updateCategory = asyncHandler(async(req,res)=>{
   const {id} = req.params
   validateMongodbid(id)
    try{
    const updatedCategory = await Category.findByIdAndUpdate(id,req.body,{
        new:true
    })
    res.json(updatedCategory)

    }catch(err){
        throw new Error(err)
    }
})

const deleteCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbid(id)
     try{
     const deletedCategory = await Category.findByIdAndDelete(id)
     res.json(deletedCategory)
 
     }catch(err){
         throw new Error(err)
     }
 })
 const getCategoryById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbid(id)
     try{
     const getaCategory = await Category.findById(id)
     res.json(getaCategory)
 
     }catch(err){
         throw new Error(err)
     }
 })

 const getAllCategory = asyncHandler(async(req,res)=>{
     try{
     const getallCategory = await Category.find()
     res.json(getallCategory)
 
     }catch(err){
         throw new Error(err)
     }
 })

module.exports = {
    createCategory,updateCategory,
    deleteCategory,getCategoryById,
    getAllCategory
}