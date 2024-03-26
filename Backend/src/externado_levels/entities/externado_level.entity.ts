import { ExternadoStudent } from "src/externado_student/entities/externado_student.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class ExternadoLevel {
    @Column({primary: true, unique: true, nullable: false})
    idexternado_level: number;

    @Column({nullable: false, length: 35})
    externado_level: string;

    @OneToMany(() => ExternadoStudent, externadoStudent => externadoStudent.externadoLevel)
    externadoStudent: ExternadoStudent;

}
