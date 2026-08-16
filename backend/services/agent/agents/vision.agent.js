import { getModel } from '../config/llmModels.js'
import axios from 'axios'
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js'
import { getFromCloudinary } from '../utils/getFromCloudinary.js'


export const visionAgent = async (state) => {
    try {
        const llm = await getModel("image")
        const prompt = `You are an elite AI image prompt engineer.
        
            Convert the user request into a highly detailed image generation prompt.

            Requirements:
            
            - Cinematic lighting
            - Professional composition
            - Ultra realistic
            - High detail
            - Beautiful color palette
            - Sharp focus
            - 8K quality
            - Photorealistic
            - Depth of field
            - Professional photography
            - Stunning visuals

            Return only the image prompt.

            User Request: ${state.prompt}
        `
        const res = await llm.invoke(prompt)
        const response = res.content.trim()

        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(response)}`
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(imageResponse.data)
        const filename = `image-${Date.now()}.png`

        const { public_id, resource_type, format } = await uploadToCloudinary(filename, buffer, "image/png")
        const downloadUrl = await getFromCloudinary(public_id, resource_type, format, 24 * 60 * 60)
        return {
            ...state,
            aiResponse: [
                `# 🖼️ Image generated Successfully`,
                `![Generated Image](${downloadUrl})`,
                `📩 [Download Image](${downloadUrl})`,
                `⌛ Link expires in 10 minutes.`
            ].join('\n')
        }
    } catch (e) {
        return {
            ...state,
            aiResponse: `❌ Failed to generated Image - reason: ${e}`
        }
    }
}