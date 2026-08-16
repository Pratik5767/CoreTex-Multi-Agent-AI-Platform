import { getModel } from "../config/llmModels.js"


export const codingAgent = async (state) => {
    try {
        const intendLlm = await getModel("intend")
        const llm = await getModel("coding")

        const intendPrompt = `
            You are an intent classifier.

            Return ONLY one of these values.

            CODE_GENERATION
            CODE_REVIEW
            CODE_EXPLANATION
            DEBUGGING
            OPTIMIZATION
            CONVERSION
            DOCUMENTATION

            User Request: ${state.prompt}
        `
        const intendResponse = await intendLlm.invoke(intendPrompt)
        const intent = intendResponse.content

        if (intent == "CODE_GENERATION") {
            const prompt = `
                You are CortexAI Coding Agent.

                Generate the requested project.

                Default stack:
                - HTML
                - CSS
                - JavaScript

                Use React / Next.js / Vue ONLY if explicitly requested.

                Rules:

                - Responsive
                - Modern UI
                - CSS Variables
                - Flexbox/Grid
                - Smooth Scroll
                - Hover Effects
                - Beautiful spacing
                - Single page unless user asks otherwise.
                
                IMAGES:
                =========================

                Always use real Unsplash images.

                Never use placeholder images.

                Never use source.unsplash.com — it is shut down and all URLs from it are broken.

                Only use images.unsplash.com/photo-{id} URLs with a real, existing photo ID.

                Never invent or guess a photo ID.
                
                Return ONLY valid JSON.

                Schema:

                {
                    "files":[
                        {
                            "name":"index.html",
                            "content":"..."
                        },
                        {
                            "name":"style.css",
                            "content":"..."
                        },
                        {
                            "name":"script.js",
                            "content":"..."
                        }
                    ]
                }

                Rules:

                - Output must start with {
                - Output must end with }
                - No markdown
                - No explanation
                - No extra text
                - No \`\`\`
                - Never mention intent

                User Request: ${state.prompt}
            `
            const response = await llm.invoke(prompt)
            const data = JSON.parse(response.content)

            return {
                ...state,
                aiResponse: "Code Generated Successfully",
                artifacts: [
                    {
                        id: Date.now(),
                        type: "Project",
                        files: data.files || [],
                        title: state.prompt
                    }
                ]
            }
        }

        const prompt = `
            The user's request is: ${intent}

            Return Markdown only.

            Never generate project files.

            Use headings like:

            # Overview

            ## Explanation

            ## Problems

            ## Improvements

            ## Best Practices

            ## Optimized Code (if needed)

            User Request: ${state.prompt}
        `
        const response = await llm.invoke(prompt)
        const data = response.content
        return {
            ...state,
            aiResponse: data,
            artifacts: []
        }
    } catch (error) {
        return {
            ...state,
            aiResponse: `❌ Failed to generated Code - reason: ${e}`
        }
    }
}