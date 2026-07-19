import express from "express"
import { createConversationController, getConversationsController, getMessagesController, saveMessageController, updateConversationController } from "../controllers/chat.controller.js"


const router = express.Router()

router.get("create-conversation", createConversationController)
router.get("get-conversations", getConversationsController)
router.post("update-conversation", updateConversationController)

router.post("save-message", saveMessageController)
router.get("get-messages/:conversationId", getMessagesController)


export default router