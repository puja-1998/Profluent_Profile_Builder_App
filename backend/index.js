import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './config/ConnectDB.js'
import cors from "cors";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

// Import all route files
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import creditRoutes from './routes/credits.js';
//import paymentRoutes from './routes/payments.js';
import fileRoutes from './routes/files.js';
import shareRoutes from './routes/share.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

ConnectDB();

//middleware
app.use(helmet()); // Add security headers
app.use(cors({ origin: ["https://profluent-profile-builder-app-frontend.onrender.com/api","http://localhost:5173/api"],  credentials: true })); // Allow requests from frontend
app.use(express.json({ limit: "1mb" })); // Parse incoming JSON payloads
app.use(morgan("dev")); // Log each request in console
app.use(rateLimit({ windowMs: 60_000, max: 120 })); // Limit each IP to 120 requests per minute


//API Routes
app.use("/api/auth", authRoutes);         // User login, register, profile, logout
app.use("/api/profile", profileRoutes);   // Profile builder (create, edit, autosave)
app.use("/api/credits", creditRoutes);    // Credits balance + history
//app.use("/api/payments", paymentRoutes);  // Subscriptions + top-ups via Stripe
app.use("/api/files", fileRoutes);        // Photo + CV uploads
app.use("/api/share", shareRoutes);       // Public profile + PDF export


//404 Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// get response from server 
app.get("/",(req , res)=>{
    res.send("Hello from Server")
})

app.listen(port, (err)=>{
    if(err){
        console.log("Error while connecting to the server!");
        
    }else{
        console.log(`Server is running at the http://localhost:${port}`);
        
    }
})