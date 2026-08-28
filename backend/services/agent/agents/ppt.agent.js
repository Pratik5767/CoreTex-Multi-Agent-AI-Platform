import { getModel } from "../config/llmModels.js"
import { generatePPT } from "../utils/generatePPT.js"
import { getFromCloudinary } from "../utils/getFromCloudinary.js"
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js"


export const pptAgent = async (state) => {
    try {
        // Get the LLM for ppt generation
        const llm = await getModel("ppt")
        // Turns the user's raw request into a detailed ppt-generation prompt
        const prompt = `You are a professional presentation designer.
            
            Return ONLY valid JSON

            Format:

            {
            "title":"",
            "subtitle":"",
            "slides":[
            {
            "title":"",
            "points":[
            "",
            "",
            "",
            ""
            ]
            }
            ]
            }

            Rules:

            - Generate exactly 6 content slides
            - Each slide should have 4-6 concise bullet points.
            - No markdown.
            - No explanation.
            - No code block.
            - Return ONLY JSON.

            Topic: ${state.prompt}
        `

        // Call the LLM to generate the response
        const response = await llm.invoke(prompt)
        // Parse the LLM's response content from a JSON string into a JS object
        const data = JSON.parse(response.content)
        
        // deducting the credits for ppt agent usage
        await deductCredits(state.userId, "ppt")
        
        // Generate the PPT from the provided data
        const ppt = await generatePPT(data)
        // writing the ppt into buffer type to send on cloud
        const buffer = await ppt.write({ outputType: "nodebuffer" })

        const filename = `ppt-${Date.now()}.pptx`
        // uploading the ppt on cloudinary
        const { public_id, resource_type, format } = await uploadToCloudinary(
            filename, buffer, "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )
        // fetching the ppt from cloudinary as a downloadable url
        const downloadUrl = await getFromCloudinary(public_id, resource_type, format, 24 * 60 * 60)

        return {
            ...state,
            aiResponse: [
                `# PPT generated Successfully`,
                `**${data.title}**`,
                `📩 [Download PPT](${downloadUrl})`,
                `⌛ Link expires in 10 minutes.`
            ].join('\n')
        }
    } catch (error) {
        return {
            ...state,
            aiResponse: `❌ Failed to generated PPT - reason: ${error}`
        }
    }
}
