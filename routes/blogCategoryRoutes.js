const express = require("express")
const { createCategory, updateCategory, deleteCategory, getCategoryById, getAllCategory } = require("../controllers/blogCategoryController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post("/",authMiddleware,isAdmin,createCategory)
router.get("/:id",getCategoryById)
router.get("/allCategory",getAllCategory)
router.put("/update/:id",authMiddleware,isAdmin,updateCategory)
router.delete("/delete/:id",authMiddleware,isAdmin,deleteCategory)

module.exports = router