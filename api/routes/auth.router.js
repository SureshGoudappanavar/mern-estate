import express from "express"; 
import { google, signup } from "../controllers/auth.controller.js";
import { signin,signOut } from "../controllers/auth.controller.js";
const router=express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.post("/signout", signOut); // ✅ fix: use POST

export default router;