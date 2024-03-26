import { ExternadoStudent } from "src/externado_student/entities/externado_student.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class ExternadoChurch {

    @Column({primary: true, unique: true, nullable: false})
    idexternado_church: number;

    @Column({nullable: false, length: 45})
    externado_church_value: string;

    @OneToMany(() => ExternadoStudent, externadoStudents => externadoStudents.externado_student_non_catholic_church_id)
    externadoStudents: ExternadoStudent;

}
