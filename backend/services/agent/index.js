import express from "express"
import connectDB from "./config/db.js"
import dns from "dns"
import router from "./routes/agent.route.js"
import dotenv from "dotenv"
dotenv.config()


dns.setServers(["1.1.1.1", "8.8.8.8"])

const port = process.env.PORT

const app = express()

app.use(express.json())
app.use("/", router)

app.use("/", (req, res) => {
    res.json({ message: "Hello from agent" })
})

app.listen(port, () => {
    console.log(`Agent started at port: ${port}`)
    connectDB()
})
