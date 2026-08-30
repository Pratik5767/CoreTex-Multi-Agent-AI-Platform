import express from 'express'
import { agentController } from '../controllers/agent.controller.js'
import multer from '../config/multer.js'


const router = express.Router()

router.post('/chat', multer.single("file"), agentController)


export default router