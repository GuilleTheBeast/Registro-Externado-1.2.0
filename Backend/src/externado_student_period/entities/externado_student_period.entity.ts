import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ExternadoStudentPeriod {
    @Column({primary: true, unique: true, nullable: false})
    id_student_period: number;

    @Column()
    id_student: number;

    @Column()
    id_period: number;
}