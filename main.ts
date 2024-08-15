import Express, { query } from 'express';
import dotenv from 'dotenv';
import { mssqldb } from './src/db';
import bodyParser from 'body-parser';
import studentForm, { createUserRoleRouter, emailRouter, exportExcelRouter, getAllForPrincipleRouter, loginRouter } from './controller';
import { getAllForPrinciple } from './service';
dotenv.config();

const port =  process.env.PORT;

const app = Express();

app.use(Express.json());

app.use(bodyParser.json());

app.listen(port,()=>{
    console.log('CONSOLE LOG--->App is listening to port:--->',port);
})

mssqldb.initialize()
    .then(() => {
            return console.log("Console.log--->App is successfully connected to DB")
    })
    .catch((error:any) => console.log("Console.log-->Error message-->",error));


app.use("/login",loginRouter);

app.use("/userRole",createUserRoleRouter);

app.use("/EnquiryForm",studentForm);

app.use("/export",exportExcelRouter);

app.use("/emailer",emailRouter);

app.use("/getAll",getAllForPrincipleRouter);