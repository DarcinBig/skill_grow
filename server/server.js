import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// Initialize Express
const app = express()

// Middleware
app.use(cors())

// Route
app.get('/', (req, res) => res.send('API is Working!'))

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

