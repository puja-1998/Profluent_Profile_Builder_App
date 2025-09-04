import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import ConnectDB from './config/ConnectDB.js'
const app = express();
const port = process.env.PORT || 3000;
ConnectDB();


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