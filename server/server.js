import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoutes.js'
import userRouter from './routes/userRoutes.js'

// Initialize Express
const app = express()

/** ================================================================================ */

// DEBUGGING

// Issue: 500 Internal Server Error (Stripe)

/**  Cause: 
 * 
 * Stripe needs to receive the raw body of the request to check the webhook
 * signature. In your server.js file, I defined the /stripe route with
 * express.raw({type: 'application/json'}). However, other middleware,
 * such as clerkMiddleware() or express.json() defined for other routes,
 * is probably executed beforehand and already transforms the request body into JSON.
 * When my /stripe handler is reached, the body is no longer “raw”,
 * the signature check fails, and this generates an error resulting in a
 * code 500 returned to Stripe.
 * 
*/

// Solution: I moved the Stripe webhook route declaration before any other middleware
// that might parse the request body.

/** ================================================================================ */

// Routes that require a raw request body (like Stripe)
// Place BEFORE express.json() or other body parsers
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Connect to database
await connectDB()
await connectCloudinary()

// Middlewares
app.use(cors())
app.use(clerkMiddleware())

// Routes (API Endpoints)
app.get('/', (req, res) => res.send('API is Working!'))
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

