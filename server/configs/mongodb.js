import mongoose from "mongoose"

// Connect to the MongoDB database
const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Database Connected'))
    await mongoose.connect(`${process.env.MONGODB_URI}/skill_grow`)
}

export default connectDB