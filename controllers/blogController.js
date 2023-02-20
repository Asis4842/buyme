const Blog = require("../models/blogModel")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const validateMongodbid = require("../utils/validateMongodbid");


const createBlog = asyncHandler(async(req,res)=>{
try{

const newBlog = await Blog.create(req.body)
res.json({
    status:"success",
    newBlog
})
}catch(err){
    throw new Error(err)
}
})

const updateBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbid(id)
    try{
    
    const updatedBlog = await Blog.findByIdAndUpdate(id,req.body,{
        new:true
    })
    res.json(updatedBlog)
    }catch(err){
        throw new Error(err)
    }
    })

    const getBlog = asyncHandler(async(req,res)=>{
        const {id} = req.params
        validateMongodbid(id)
        try{
        
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes')
       const updateViews= await Blog.findByIdAndUpdate(id,{
            $inc:{numViews:1}
        },{new:true})
        res.json(getBlog)
        }catch(err){
            throw new Error(err)
        }
        })

    
        const getAllBlog = asyncHandler(async(req,res)=>{
         
            try{
            
            const getBlogs = await Blog.find()
            res.json(getBlogs)
         
            }catch(err){
                throw new Error(err)
            }
            })

    
const deleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbid(id)
    try{
    
    const deletedBlog = await Blog.findByIdAndDelete(id)
    res.json(deletedBlog)
    }catch(err){
        throw new Error(err)
    }
    })

    const dislikeBlog = asyncHandler(async(req,res)=>{
        const {blogId} = req.body
        try{
        validateMongodbid(blogId)
        const blog = await Blog.findById(id)
      const loginUserId = req?.user._id
      const isDisLiked = blog?.isDisliked

      const alreadyLiked = blog?.likes?.find((userId)=>userId?.toString()===loginUserId?.toString())

if(alreadyLiked){
    const blog = await Blog.findByIdAndUpdate(blogId,{
        $pull:{likes:loginUserId},
        isLiked:false
    },{
        new:true
    })
    res.json(blog)
}

if(isDisLiked){
    const blog = await Blog.findByIdAndUpdate(blogId,{
        $pull:{dislikes:loginUserId},
        isDisliked:false
    },{
        new:true
    })
    res.json(blog)
}else{
    const blog = await Blog.findByIdAndUpdate(blogId,{
        $push:{dislikes:loginUserId},
        isDisliked:true
    },{
        new:true
    })
    res.json(blog)

}


        }catch(err){
            throw new Error(err)
        }
        })

        const likeBlog = asyncHandler(async(req,res)=>{
            const {blogId} = req.body
            try{
            validateMongodbid(blogId)
            const blog = await Blog.findById(id)
          const loginUserId = req?.user._id
          const isLiked = blog?.isLiked
    
          const alreadyDisLiked = blog?.dislikes?.find((userId)=>userId?.toString()===loginUserId?.toString())
    
    if(alreadyDisLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false
        },{
            new:true
        })
        res.json(blog)
    }
    
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false
        },{
            new:true
        })
        res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push:{likes:loginUserId},
            isLiked:true
        },{
            new:true
        })
        res.json(blog)
    
    }
    
    
            }catch(err){
                throw new Error(err)
            }
            })       

module.exports = {
    createBlog,updateBlog,
    getBlog,getAllBlog,
    deleteBlog,likeBlog,
    dislikeBlog
}