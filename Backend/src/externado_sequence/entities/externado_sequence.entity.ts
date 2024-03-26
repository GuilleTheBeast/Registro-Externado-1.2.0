import { Column, Entity } from "typeorm";

@Entity()
export class ExternadoSequence {
    @Column({primary: true, unique: true, nullable: false})
    idexternado_sequence: number;

    @Column({nullable: false})
    idexternado_user_sequence: number;

    @Column({nullable: false})
    idexternado_admin_sequence: number;
    
    @Column({nullable: false})
    idexternado_responsible_sequence: number;

    @Column({nullable: false})
    idexternado_student_sequence: number;

    @Column({nullable: false})
    idexternado_admin_system_sequence: number;

    @Column({nullable: false})
    idexternado_level: number;

    @Column({nullable: false})
    idexternado_department: number;
}
