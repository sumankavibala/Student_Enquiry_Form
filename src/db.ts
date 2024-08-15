import "reflect-metadata"
import { DataSource } from "typeorm"
import { EnquiryForm, user_role } from "../model"


export const mssqldb = new DataSource({
    type: "mssql",
    host: "localhost",
    port: 1433,
    username: "sa",
    password: "changeme",
    database: "test_db",
    synchronize: true,
    logging: false,
    requestTimeout:30000,
    entities: [EnquiryForm,user_role],
    subscribers: [],
    migrations: [],
    extra: {
        trustServerCertificate:true
    }
})

