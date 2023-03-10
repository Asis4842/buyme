const express = require("express")
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require("../controllers/blogController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImages")
const router = express.Router()

router.post('/',authMiddleware,isAdmin,createBlog)
router.put('/update/:id',authMiddleware,isAdmin,updateBlog)
router.delete('/delete/:id',authMiddleware,isAdmin,deleteBlog)
router.get('/:id',getBlog)
router.get('/allBlogs',getAllBlog)
router.put('/likes',authMiddleware,likeBlog)
router.put('/dislikes',authMiddleware,dislikeBlog)
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array('images',2),blogImgResize,uploadImages)

module.exports = router