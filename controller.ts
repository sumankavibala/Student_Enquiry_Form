import Router from "express";
import { authenticateToken, createUserRole, deleteEF, emailer, getAllForPrinciple, getEF, getExcel, insertEF, login, updateEF } from "./service";

export const loginRouter = Router();
loginRouter.post('/login' , (req,res) => login(req,res));

export const createUserRoleRouter = Router();
createUserRoleRouter.post("/create",(req,res)=>createUserRole(req,res));

const studentForm =Router();

studentForm.post("/insert",authenticateToken,(req,res)=>insertEF(req,res));

studentForm.put("/update",authenticateToken,(req,res)=>updateEF(req,res));

studentForm.delete("/delete/:StudentID",authenticateToken,(req,res)=>deleteEF(req,res));

studentForm.get("/getall",authenticateToken,(req,res)=>getEF(req,res));

export default studentForm;

export const exportExcelRouter = Router();
exportExcelRouter.get("/getExcel",(req,res)=>getExcel(req,res));

export const emailRouter = Router();
emailRouter.post('/mail',(req,res)=>emailer(req,res));

export const getAllForPrincipleRouter = Router();
getAllForPrincipleRouter.get("/getAllForPrinciple",(req,res)=>getAllForPrinciple(req,res));
