import { ExternadoResponsible } from "src/externado_responsible/entities/externado_responsible.entity";
import { ExternadoStudent } from "src/externado_student/entities/externado_student.entity";
import { ExternadoUserType } from "src/externado_user_types/entities/externado_user_type.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class ExternadoUser {
    
    @Column({primary: true, unique: true, nullable: false})
    idexternado_user: number;

    @Column({unique: true, nullable: false, length: 100})
    externado_email: string;

    @Column({nullable: false, length: 100})
    externado_pass: string;

    @Column({nullable: false, default: 2})
    externado_user_type_id: number;

    @ManyToOne(() => ExternadoUserType, externadoUserType => externadoUserType.idexternado_user_type)
    @JoinColumn({name: "externado_user_type_id"})
    externadoUserType: ExternadoUserType;

    @Column({nullable: false, default: 1})
    externado_active_user: boolean;

    @Column({nullable: false, default: 0})
    externado_reset_password: boolean;

    @Column({nullable: false})
    externado_creation_datetime: Date;

    @Column({nullable: false, length: 60})
    externado_generic_pass: string;

    @Column({nullable: false, default: 0})
    externado_active_email: boolean;

    @Column({nullable: false, default: 0})
    externado_massive_created: boolean;

    @Column({nullable: false, unique: true, length: 45})
    externado_uuid: string;

    @OneToMany(() => ExternadoResponsible, responsible => responsible.externadoUser)
    responsible = ExternadoResponsible

    @OneToMany(() => ExternadoStudent, student => student.externadoUser)
    student = ExternadoStudent

}
