import { ExternadoResponsible } from "src/externado_responsible/entities/externado_responsible.entity";
import { ExternadoStudent } from "src/externado_student/entities/externado_student.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class ExternadoDepartment {
    @Column({primary: true, unique: true, nullable: false})
    idexternado_departments: number;

    @Column({nullable: false, length: 30})
    externado_department: string;

    @OneToMany(() => ExternadoResponsible, externadoResponsible => externadoResponsible.externadoDepartment)
    externadoResponsible: ExternadoResponsible;

    @OneToMany(() => ExternadoStudent, externadoStudent => externadoStudent.externadoDepartment)
    externadoStudent: ExternadoStudent;
}
