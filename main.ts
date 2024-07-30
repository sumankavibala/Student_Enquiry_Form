import Express from "express";

import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

const app = Express();

app.listen (port,()=>{
    console.log("This is console log ---->App is successfully running---->on port number:"+port);  
})