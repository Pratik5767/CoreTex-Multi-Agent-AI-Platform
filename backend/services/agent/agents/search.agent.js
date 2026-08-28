import { searchTool } from "../config/tavily.js"


export const searchAgent = async (state) => {
    try {
        const results = await searchTool.invoke({ query: state.prompt })

        // deducting the credits for search agent usage
        await deductCredits(state.userId, "search")

        const trimmedResults = (results.results || []).map(r => ({
            title: r.title,
            url: r.url,
            content: r.content?.slice(0, 200)
        }))

        return {
            ...state,
            searchResults: trimmedResults,
            images: (results.images || []).splice(0, 5)
        }
    } catch (error) {
        return {
            ...state,
            searchResults: [],
            images: [],
            aiResponse: `❌ Failed to search - reason: ${error}`
        }
    }
}