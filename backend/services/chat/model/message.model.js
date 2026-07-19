import mongoose from "mongoose"


const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversation"
    },
    role: {
        type: String,
        enum: ["user", "assistant"]
    },
    content: String
}, { timestamps: true })


const messageModel = mongoose.model("Message", messageSchema)

export default messageModel