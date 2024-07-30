import Express, { response } from "express";
import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();


const port = process.env.PORT;

const app = Express();

//MS SQL server configuration
const config={
    "user": "sa",
    "password": "changeme",
    "server":"1433",
    "database":"test_db",
    "options":{
        "encrypt":false
    }
}

sql.connect(config,()=>{
    console.log("This is console log--->sql connect config--->MS-SQL DB connected successfully")
})

app.listen (port,()=>{
    console.log("This is console log--->App is successfully running--->on port number:"+port);  
})


