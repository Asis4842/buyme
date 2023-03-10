const express = require("express")
const { createUser, loginUser, getAllUser, getaUser, deleteUser, updateUser, blockUser, unBlockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, getAllOrders, getOrderByUserId, updateOrderStatus } = require("../controllers/userController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")

const router = express.Router()

router.post("/register",createUser)
router.post("/login",loginUser)
router.post("/admin-login",loginAdmin)

router.post("/cart",authMiddleware,userCart)
router.get("/get-cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId);
router.put("/order/update-order/:id",authMiddleware,isAdmin,updateOrderStatus
  );


router.put("/updatePassword",authMiddleware,updatePassword)
router.post("/forgotPassword",forgotPasswordToken)
router.put("/reset-password/:token",resetPassword)

router.get("/all-users",getAllUser)
router.get("/:id",authMiddleware,getaUser)
router.delete("/:id",deleteUser)
router.put("/edit-user",authMiddleware,updateUser)

router.put("/block-user/:id",authMiddleware,isAdmin,blockUser)
router.put("/unblock-user/:id",authMiddleware,isAdmin,unBlockUser)

router.get("/refresh",handleRefreshToken)
router.get("/logout",logout)

router.get("/wishlist",authMiddleware,getWishlist)
router.put("/save-address",authMiddleware,saveAddress)



module.exports = router