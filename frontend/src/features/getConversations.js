import api from "../utils/axios.js"


const getConversations = async () => {
    try {
        const { data } = await api.get('/api/chat/get-conversations')
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}


export default getConversations