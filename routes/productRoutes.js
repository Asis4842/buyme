
const express = require("express")
const { createProduct, getProductById, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages } = require("../controllers/productContoller")
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware")
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages")
const router = express.Router()

router.post("/createProduct",authMiddleware,isAdmin,createProduct)
router.get("/:id",getProductById)
router.put("/update/:id",authMiddleware,isAdmin,updateProduct)
router.delete("/delete/:id",authMiddleware,isAdmin,deleteProduct)
router.get("/allProducts",getAllProduct)

router.put("/addToWishlist",authMiddleware,addToWishlist)
router.put("/ratings",authMiddleware,rating)

router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array('images',10),productImgResize,uploadImages)



module.exports = router