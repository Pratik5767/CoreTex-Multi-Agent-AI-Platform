import { getModel } from "../config/llmModels.js"
import { generatePdf } from "../utils/generatePdf.js"
import { getFromCloudinary } from "../utils/getFromCloudinary.js"
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js"


export const pdfAgent = async (state) => {
    try {
        // Get the LLM configured for pdf generation
        const llm = await getModel('pdf')
        // Turns the user's raw request into a detailed pdf-generation prompt
        const prompt = `You are an expert document writer.
            
            Return ONLY valid JSON
            
            Do NOT return markdown.

            Do NOT return explanations.

            Structure:
            {
            "title": "",
            "subtitle": "",
            "sections":[
            {
            "heading": "",
            "points": []
            }
            ]
            }

            Generate 4-8 sections.

            Each section should have 3-6 concine bullet points.

            Topic: ${state.prompt}
        `
        // Call the LLM to generate the enhanced pdf prompt
        const res = await llm.invoke(prompt)
        // Parse the LLM's response content from a JSON string into a JS object
        const data = JSON.parse(res.content)
        console.log(data)
        // Generate the PDF file as a buffer from the provided data
        const pdfBuffer = await generatePdf(data)
        console.log(pdfBuffer)

        const filename = `pdf-${Date.now()}.pdf`
        // uploading the pdf on cloudinary
        const { public_id, resource_type, format } = await uploadToCloudinary(filename, pdfBuffer, "application/pdf")
        // fetching the pdf from cloudinary as a downloadable url
        const downloadUrl = await getFromCloudinary(public_id, resource_type, format, 24 * 60)

        return {
            ...state,
            aiResponse: [
                `# PDF Generated Successfully`,
                `**${data.title}**`,
                `📩 [Download PDF](${downloadUrl})`,
                `⌛ Link expires in 10 minutes.`
            ].join('\n')
        }
    } catch (error) {
        return {
            ...state,
            aiResponse: `❌ Failed to generated PDF - reason: ${error}`
        }
    }
}