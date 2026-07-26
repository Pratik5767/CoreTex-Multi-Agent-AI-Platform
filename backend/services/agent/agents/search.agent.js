import { searchTool } from "../config/tavily.js"


export const searchAgent = async (state) => {
    try {
        const results = await searchTool.invoke({ query: state.prompt })

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
        console.log(error)
        return {
            ...state,
            searchResults: [],
            images: []
        }
    }
}