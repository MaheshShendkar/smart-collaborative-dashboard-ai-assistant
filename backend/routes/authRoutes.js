import express from "express";
import{
    register,
    login,
    logout,
    refreshToken,
    me
} from "../controllers/authController.js";
import {protect} from "../middlware/authMiddlware.js";

const router=express.Router();

router.post("/register", register);
router.post("/login",login);
router.post("/refresh",refreshToken);
router.post("/logout",logout);
router.get("/me",protect,me);

export default router;