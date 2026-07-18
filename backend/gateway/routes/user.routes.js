import express from "express"
import { getCurrentUser } from "../controller/user.controller.js"
import protect from "../middleware/auth.middleware.js"


const router = express.Router()

router.get("/api/me", protect, getCurrentUser)


export default router
