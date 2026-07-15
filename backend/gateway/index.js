import express from "express"
import proxy from "express-http-proxy"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()


const port = process.env.PORT

const app = express()

app.use("/", (req, res) => {
    res.json({ message: "Hello from Gateway" })
})

app.listen(port, () => {
    console.log(`Gateway started at port: ${port}`)
})