import { Router } from "express";
import { login, signup } from "../controllers/userController";

const router =  Router();

router.post("/signup", signup)
router.get("/login", login)


export default router;