import express from "express"
import dotenv from "dotenv"
import dns from "dns"
dotenv.config()


dns.setServers(["1.1.1.1", "8.8.8.8"])

const port = process.env.PORT

const app = express()

app.use("/", (req, res) => {
    res.json({ message: "Hello from auth" })
})

app.listen(port, () => {
    console.log(`Auth started at port: ${port}`)
})
