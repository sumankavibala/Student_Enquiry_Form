const Joi = require('joi');


export const validateEnquiryForm = Joi.object({
    Studentname:Joi.string().required(),
    FatherName:Joi.string().required(),
    PhoneNumber:Joi.number().min(1000000000).max(9999999999).required(),
    Pincode:Joi.number().min(100000).max(999999).required(),
    Age:Joi.number().required(),
    Gender:Joi.string().required(),
})

export const validateUserRole = Joi.object({
    user_id:Joi.number().required(),
    user_name:Joi.string().required(),
    password: Joi.string()
    .min(4).max(30)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/\d/)
    .pattern(/[@$!%*?&#]/).required()
    .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must be at most 30 characters long',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
        'any.required': 'Password is required'
      }),
    mail_id:Joi.string().email().required(),
    designation_id:Joi.number().required(),
   })
   

   export interface StudentFormDTO{
    Createdby: any;
    StudentID:number,
    Studentname:string
    FatherName: string
    PhoneNumber:string,
    Pincode:number,
    Age:number,
    Gender:string,
   }

   export interface UserRoleDTO{
    user_name:string,
    password:string
   }