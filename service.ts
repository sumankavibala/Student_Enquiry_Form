import Console, { error } from "console";
import {
  StudentFormDTO,
  UserRoleDTO,
  validateEnquiryForm,
  validateUserRole,
} from "./dto";
import { EnquiryForm, user_role } from "./model";
import { mssqldb } from "./src/db";
import ExcelJS from "exceljs";
import JsonWebToken from "jsonwebtoken";
import dotenv from "dotenv";
import Bcrypt from "bcrypt";
import { Response } from "express";
import nodemailer from "nodemailer";
dotenv.config();

export const emailer = async(req: any, res: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      tls: {
        ciphers:'SSLv3'
      },
      auth: {
        user: "nils.mosciski83@ethereal.email",
        pass: "x8yTmHBCxMtV7HZh1V",
      },
    });

    const mailOptions = {
      from: "nils.mosciski83@ethereal.email",
      to: "barathkrishna2108@gmail.com",
      subject: "Nodemailer Project TOO",
      text: "Hi from your nodemailer project",
    };

    const emailSender = await transporter.sendMail(mailOptions);
    console.log("emailSender-->>", emailSender);
    res.status(200).send({
      result: "Email sent successfully1",
    });
  } catch (error) {
    console.log("Error-->>", error);
    res.status(400).send({
      result: "Error-->> Failed to send mail",
    });
  }
};

export const authenticateToken = (req: any, res: any, next: any) => {
  try {
    const token = req.headers["token"];

    const decode = JsonWebToken.decode(token, { json: true });

    const designation_id = decode?.designation_id;

    const method = req.method;

    if (!token) {
      throw new Error("Error-->Token Required");
    }

    const getJWT = JsonWebToken.verify(token, process.env.JWT_SECRET as string);

    if (!designation_id) {
      throw new Error("Designation required");
    }

    if (designation_id == 3 && method == "POST") {
      throw new Error("Access restricted");
    }

    if (designation_id === 3 && method == "PUT") {
      throw new Error("Access restricted");
    }

    if (designation_id == 3 && method == "DELETE") {
      throw new Error("Access restricted");
    }

    if (designation_id == 2 && method == "PUT") {
      throw new Error("Access restricted");
    }

    if (designation_id == 2 && method == "DELETE") {
      throw new Error("Access restricted");
    }

    next();
  } catch (error: any) {
    res.status(400).send({
      result: "Authentication failed-->Error is-->" + error.message,
    });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const secretkey: any = process.env.JWT_SECRET as string;
    const payload: UserRoleDTO = req.body;
    const verifyUserRepo = mssqldb.getRepository(user_role);
    const usernameRepo = await verifyUserRepo.findOneBy({
      user_name: payload.user_name,
    });

    if (!usernameRepo) {
      throw new Error("Invalid Username");
    }

    const isMatch = await Bcrypt.compare(
      payload.password,
      usernameRepo.password
    );
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const tokenObject = {
      ...payload,
      designation_id: usernameRepo.designation_id,
    };
    const token = JsonWebToken.sign(tokenObject, secretkey, {
      expiresIn: "1000s",
    });

    // console.log("Username & password matches---> Token generate--->",token);
    res.status(200).send({
      result: "Username & Password matches-->Token generated-->",
      designation_id: usernameRepo.designation_id,
      token,
    });
  } catch (error: any) {
    // console.log("Error from user verification", error.message);
    res.status(400).send({
      result: "Response 400-->Error message-->" + error.message,
    });
  }
};

export const createUserRole = async (req: any, res: any) => {
  try {
    // console.log("console.log---> Payload is --->", req);
    const payload = req.body;
    // console.log("console.log---> Payload is --->" + payload);
    const validatecreateUserRolePayload = validateUserRole.validate(payload);
    if (validatecreateUserRolePayload.error) {
      throw new Error(validatecreateUserRolePayload.error.message);
    }
    const hashedpassword = await Bcrypt.hash(payload.password, 10);
    payload.password = hashedpassword;
    const userInsertRepo = mssqldb.getRepository(user_role);
    await userInsertRepo.save(payload);
    // console.log("console.log---> user is inserted into the DB");
    res.status(200).send({
      result: "Response 200 --> User added successfully",
    });
  } catch (error: any) {
    console.log(
      "console.log--->error while inserting a user into DB--->" + error.message
    );
    res.status(400).send({
      result: "Response 400 --> Error message--->" + error.message,
    });
  }
};

export const insertEF = async (req: any, res: any) => {
  try {
    const token = req.headers["token"];
    console.log("token--->>",token);
    const decode = JsonWebToken.decode(token,{json:true});
    console.log("decode--->>",decode);
    const designationIdFormToken = decode?.designation_id;
    let payload: StudentFormDTO = req.body;
    const validateFormInputs = validateEnquiryForm.validate(payload);
    if (validateFormInputs.error?.details?.length > 0) {
      throw new Error(validateFormInputs.error.details[0].message);
    }
    const EFRepo = mssqldb.getRepository(EnquiryForm);
    const dataGotByPhoneNumber = await EFRepo.findBy({
      PhoneNumber: payload.PhoneNumber?.toString(),
    });
    if (dataGotByPhoneNumber.length > 0) {
      throw new Error("Phone number Already Exist");
    }
    const orderByStudentID = await EFRepo.query(
      "SELECT TOP (1)[StudentID]  FROM [test_db].[dbo].[enquiry_form] order by StudentID desc;"
    );
    // payload.StudentID =
    //   orderByStudentID?.length <= 0 ? 1001 : 1 + orderByStudentID[0]?.StudentID;
    if (orderByStudentID?.length <= 0) {
      payload.StudentID = 1001;
    } else {
      payload.StudentID = 1 + orderByStudentID[0]?.StudentID;
    }
      const designation_idfromdecode = decode?.designation_id;
      console.log("designation_idfromdecode-->>",designation_idfromdecode);
      payload.Createdby = designation_idfromdecode;
      console.log("final payload-->",payload);
      await EFRepo.save(payload);
    res.status(200).send({
      result: "data Successfully inserted",
    });
  } catch (error: any) {
    res.status(400).send({
      result: "Data insertion unsuccessful" + error.message,
    });
  }
};

export const updateEF = async (req: any, res: any) => {
  try {
    const payload: StudentFormDTO = req.body;
    if (!payload.StudentID) {
      throw new Error("User Error-->Student ID mandatory");
    }
    const studentIDPayload = payload.StudentID;
    const enquiry_formRepo = mssqldb.getRepository(EnquiryForm);
    const studentIDDB = await enquiry_formRepo.query(
      `SELECT * FROM [test_db].[dbo].[enquiry_form] where StudentID =${payload.StudentID}`
    );
    console.log("console log-->studentIDDB--->", studentIDDB);
    if (studentIDDB.length == 0) {
      throw new Error("User Error--> Student ID not found");
    }
    const updateEFvalidation = validateEnquiryForm.validate(payload);

    const updateEnquiryForm = await enquiry_formRepo
      .createQueryBuilder()
      .update()
      .set({
        Studentname: payload.Studentname,
        FatherName: payload.FatherName,
        PhoneNumber: payload.PhoneNumber,
        Pincode: payload.Pincode,
        Age: payload.Age,
        Gender: payload.Gender,
        StudentID: payload.StudentID,
      })
      .where("StudentID=:StudentID", { StudentID: payload.StudentID })
      .execute();
    res.status(200).send({
      result: "Result-->Enquiry Form updated successfully",
    });
  } catch (error: any) {
    console.log("console log-->Error is-->", error.message);

    res.status(400).send({
      result: "Error is-->" + error.message,
    });
  }
};

export const deleteEF = async (req: any, res: any) => {
  try {
    const payload = req.params.StudentID;
    const enquiry_formRepo = mssqldb.getRepository(EnquiryForm);
    const studentIDDB = await enquiry_formRepo.query(
      `SELECT StudentID FROM enquiry_form where StudentID=${payload}`
    );
    if (studentIDDB.length == 0) {
      throw new Error("User Error--> Student ID not found");
    }
    const deleteEF = await enquiry_formRepo
      .createQueryBuilder()
      .delete()
      .from(EnquiryForm)
      .where("StudentID=:StudentID", { StudentID: payload })
      .execute();
    res.status(200).send({
      result: "Result-->Enquiry Form deleted successfully",
    });
  } catch (error: any) {
    res.status(400).send({
      result: "Error is-->" + error.message,
    });
  }
};

export const getEF = async (req: any, res: any) => {
  try {
    const enquiry_formRepo = mssqldb.getRepository(EnquiryForm);
    const getall = await enquiry_formRepo.query("select * from enquiry_form");
    console.log("console log -->getall-->", getall);
    res.status(200).send({
      result: "Getall result-->",
      getall,
    });
  } catch (error: any) {
    res.status(400).send({
      result: "Error on getall-->" + error.message,
    });
  }
};

export const getAllForPrinciple = async(req:any ,res:any)=>{
  try {
    const payload = req.body;
    // const EFRepo = mssqldb.getRepository(EnquiryForm);
    // const URRepo = mssqldb.getRepository(user_role);
    const getAllForPrincipleRepo = await mssqldb.query('select e.*,u.user_name from enquiry_form e inner join user_role u on e.Createdby = u.designation_id;');
    console.log("getAllForPrincipleRepo-->>",getAllForPrincipleRepo);
    res.status(200).send({
      result: "data retrieved successfully",getAllForPrincipleRepo
    })
  } catch (error:any) {
    res.status(400).send({
      result: "data not found",error
    })
  }

};

export const getExcel = async (req: any, res: any) => {
  const enquiry_formRepo = mssqldb.getRepository(EnquiryForm);
  const getAll = await enquiry_formRepo.query("select * from enquiry_form");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("My Users");
  worksheet.columns = [
    { header: "s_no", key: "s_no", width: 10 },
    { header: "id", key: "id", width: 10 },
    { header: "StudentID", key: "StudentID", width: 15 },
    { header: "Studentname", key: "Studentname", width: 15 },
    { header: "FatherName", key: "FatherName", width: 25 },
    { header: "PhoneNumber", key: "PhoneNumber", width: 10 },
    { header: "Pincode", key: "Pincode", width: 10 },
    { header: "Age", key: "Age", width: 10 },
    { header: "Gender", key: "Gender", width: 10 },
  ];
  let counter = 1;
  getAll.forEach((user: any) => {
    worksheet.addRow({
      s_no: counter,
      id: user.id,
      StudentID: user.StudentID,
      Studentname: user.Studentname,
      FatherName: user.FatherName,
      PhoneNumber: user.PhoneNumber,
      Pincode: user.Pincode,
      Age: user.Age,
      Gender: user.Gender,
    });
    counter++;
  });
  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { bold: true };
  });
  const date = new Date().toDateString();
  console.log(date);
  try {
    res.setHeader("Content-Disposition", `attachment; filename=user1.xlsx`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    await workbook.xlsx
      .writeFile(`./public/${date}.xlsx`)
      .then(() => console.log("File saved successfully"));
    res.status(200).send({
      Result: `File save successfully-->File name-->${date}`,
    });
  } catch (err: any) {
    console.error("Error generating Excel file:", err);
    // Check if headers are already sent to avoid double response
    if (!res.headersSent) {
      res.status(400).send({
        result: "Error-->Export failed-->" + err.message,
      });
    }
  }
};
