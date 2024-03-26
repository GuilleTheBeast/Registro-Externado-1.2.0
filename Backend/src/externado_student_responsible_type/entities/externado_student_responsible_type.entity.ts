import { ExternadoStudent } from "src/externado_student/entities/externado_student.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class ExternadoStudentResponsibleType {
    @Column({primary: true, unique: true, nullable: false})
    idexternado_student_responsible_type: number;

    @Column({nullable: false, length: 30})
    externado_student_responsible_type: string;

    @OneToMany(() => ExternadoStudent, externadoStudent => externadoStudent.externadoStudRespType)
    externadoStudent: ExternadoStudent;
}
