import express from "express"
import proxy from "express-http-proxy"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import router from "./routes/user.routes.js"
import { proxyWithHeader } from "./utils/proxyWithHeader.js"
import protect from "./middleware/auth.middleware.js"
dotenv.config()


const port = process.env.PORT

const app = express()

// middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser())
app.use(morgan("dev"))

// routes
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL))
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE_URL))
app.use("/api/agent", protect, proxyWithHeader(process.env.AGENT_SERVICE_URL))
app.use("/api/billing", protect, proxyWithHeader(process.env.BILLING_SERVICE_URL))
app.use("/", router)

app.use("/", (req, res) => {
    res.json({ message: "Hello from Gateway" })
})

app.listen(port, () => {
    console.log(`Gateway started at port: ${port}`)
})