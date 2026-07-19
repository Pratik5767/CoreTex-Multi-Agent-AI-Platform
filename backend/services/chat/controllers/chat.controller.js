import conversationModel from "../model/conversation.model.js"
import messageModel from "../model/message.model.js"


export const createConversationController = async (req, res) => {
    try {
        const userId = req.headers['x-user-id']
        console.log('userId', userId)

        const conversation = await conversationModel.create({ userId: userId })

        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json({ message: `create conversation error ${error}` })
    }
}


export const getConversationsController = async (req, res) => {
    try {
        const userId = req.headers['x-user-id']
        console.log('userId', userId)

        const conversation = await conversationModel.find({ userId: userId }).sort({ updatedAt: -1 })

        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json({ message: `get conversation error ${error}` })
    }
}


export const updateConversationController = async (req, res) => {
    try {
        const { id, title } = req.body

        const conversation = await conversationModel.findByIdAndUpdate(id, { title })

        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json({ message: `update conversation error ${error}` })
    }
}


export const saveMessageController = async (req, res) => {
    try {
        const { conversationId, role, content } = req.body

        const message = await messageModel.create({ conversationId, content, role })

        return res.status(200).json(message)
    } catch (error) {
        return res.status(500).json({ message: `save messages error ${error}` })
    }
}


export const getMessagesController = async (req, res) => {
    try {
        const message = await messageModel.find({ conversationId: req.params.conversationId }).sort({ createdAt: -1 })

        return res.status(200).json(message)
    } catch (error) {
        return res.status(500).json({ message: `get messages error ${error}` })
    }
}