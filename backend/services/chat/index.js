import express from "express"
import connectDB from "./config/db.js"
import dns from "dns"
import dotenv from "dotenv"
import router from "./routes/chat.routes.js"
dotenv.config()


dns.setServers(["1.1.1.1", "8.8.8.8"])

const port = process.env.PORT

const app = express()

app.use(express.json())
app.use("/", router)

app.use("/", (req, res) => {
    res.json({ message: "Hello from chat" })
})

app.listen(port, () => {
    console.log(`Chat started at port: ${port}`)
    connectDB()
})
