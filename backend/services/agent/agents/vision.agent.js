import { getModel } from '../config/llmModels.js'
import axios from 'axios'
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js'
import { getFromCloudinary } from '../utils/getFromCloudinary.js'


export const visionAgent = async (state) => {
    try {
        // Get the LLM configured for image generation
        const llm = await getModel("image")
        // Turns the user's raw request into a detailed image-generation prompt
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

        // Call the LLM to generate the enhanced image prompt
        const response = await llm.invoke(prompt)
        // Extract and clean the generated prompt text from the response
        const data = response.content.trim()

        // Build the image generation URL by encoding the prompt into the API endpoint
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(data)}`
        // Fetch the generated image as binary data using the constructed URL
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })

        // deducting the credits for vision agent usage
        await deductCredits(state.userId, "vision")

        // Convert the fetched image response data into a Buffer for upload/storage
        const buffer = Buffer.from(imageResponse.data)

        const filename = `image-${Date.now()}.png`
        // uploading the image on cloudinary
        const { public_id, resource_type, format } = await uploadToCloudinary(filename, buffer, "image/png")
        // fetching the image from cloudinary as a downloadable url
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
