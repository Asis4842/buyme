
const express = require("express")
const { createProduct, getProductById, getAllProduct, updateProduct, deleteProduct } = require("../controllers/productContoller")
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/createProduct",authMiddleware,isAdmin,createProduct)
router.get("/:id",getProductById)
router.put("/update/:id",authMiddleware,isAdmin,updateProduct)
router.delete("/delete/:id",authMiddleware,isAdmin,deleteProduct)
router.get("/allProducts",getAllProduct)




module.exports = router