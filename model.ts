import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm"

@Entity()
@Unique(["Studentname", "FatherName"])
export class EnquiryForm {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    StudentID: number

    @Column({name:"Studentname"})
    Studentname: string

    @Column({name:"FatherName"})
    FatherName: string

    @Column({type:"bigint",unique:true})
    PhoneNumber: string

    @Column()
    Pincode: number
    
    @Column()
    Age: number

    @Column()
    Gender: String

    @Column()
    Createdby: number

}


@Entity()
export class user_role {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique:true})
    user_id: number

    @Column()
    user_name: string

    @Column()
    password: string

    @Column({unique:true})
    mail_id: string

    @Column()
    designation_id: number
    
}





   