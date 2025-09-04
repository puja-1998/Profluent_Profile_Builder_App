import express from 'express'
import dotenv from 'dotenv'

const app = express();
const port = process.env.PORT || 3000;

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