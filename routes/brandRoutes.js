const express = require("express")
const { createBrand, updateBrand, deleteBrand, getBrandById, getAllBrand } = require("../controllers/brandController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post("/",authMiddleware,isAdmin,createBrand)
router.get("/:id",getBrandById)
router.get("/allBrand",getAllBrand)
router.put("/update/:id",authMiddleware,isAdmin,updateBrand)
router.delete("/delete/:id",authMiddleware,isAdmin,deleteBrand)

module.exports = router