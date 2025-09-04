import mongoose from 'mongoose'

const ConnectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL);
        console.log(` MongoDB connected: ${connect.connection.name}`);
        
    } catch (error) {
        console.error(" Database connection error:", error.message);
        process.exit(1); // Stop the server on connection failure
    }
}

export default ConnectDB;