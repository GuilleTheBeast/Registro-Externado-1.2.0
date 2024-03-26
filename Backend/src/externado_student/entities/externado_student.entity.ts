import { ExternadoChurch } from "src/externado_churchs/entities/externado_church.entity";
import { ExternadoDepartment } from "src/externado_department/entities/externado_department.entity";
import { ExternadoLevel } from "src/externado_levels/entities/externado_level.entity";
import { ExternadoStudentResponsibleType } from "src/externado_student_responsible_type/entities/externado_student_responsible_type.entity";
import { ExternadoUser } from "src/externado_users/entities/externado_user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class ExternadoStudent {
    @Column({primary: true, unique: true, nullable: false})
    idexternado_student: number;

    @Column({ unique: true, nullable: false})
    externado_user_id: number;

    @ManyToOne(() => ExternadoUser, externadoUser => externadoUser.responsible)
    @JoinColumn({name: "externado_user_id"})
    externadoUser: ExternadoUser;

    @Column({length: 60})
    externado_student_firstname: string;

    @Column({length: 60})
    externado_student_lastname: string;

    @Column({length: 120})
    externado_student_birthplace: string;

    @Column()
    externado_student_birthdate: Date;

    @Column({length: 30})
    externado_student_nationality: string;

    @Column()
    externado_student_gender: boolean;

    @Column({length: 120})
    externado_student_address: string;

    @Column({length: 30})
    externado_student_town: string;

    @Column()
    externado_student_department_id: number;

    @ManyToOne(() => ExternadoDepartment, externadoDepartment => externadoDepartment.externadoStudent)
    @JoinColumn({name: "externado_student_department_id"})
    externadoDepartment: ExternadoDepartment;

    @Column({length: 20})
    externado_student_phone: string;

    @Column({length: 60})
    externado_student_email: string;

    @Column({length: 120})
    externado_student_last_school: string;

    @Column()
    externado_student_current_level_id: number;

    @ManyToOne(() => ExternadoLevel, externadoLevel => externadoLevel.externadoStudent)
    @JoinColumn({name: "externado_student_current_level_id"})
    externadoLevel: ExternadoLevel;

    @Column()
    externado_student_has_siblings: boolean;

    @Column({length: 420})
    externado_student_siblings: string;

    @Column()
    externado_student_lives_with_parents: boolean;

    @Column({length: 60})
    externado_student_lives_with_who: string;

    @Column({length: 60})
    externado_student_lives_with_related: string;

    @Column({length: 120})
    externado_student_lives_with_address: string;

    @Column()
    externado_student_catholic: boolean;

    @Column()
    externado_student_non_catholic_church_id: number;

    @ManyToOne(() => ExternadoChurch, externadoChurch => externadoChurch.idexternado_church)
    @JoinColumn({name: "externado_student_non_catholic_church_id"})
    externadoChurch: ExternadoChurch;

    @Column({length: 45})
    externado_student_church_other: string;

    @Column({length: 60})
    externado_student_emergency_name: string;

    @Column({length: 45})
    externado_student_emergency_relationship: string;

    @Column({length: 120})
    externado_student_emergency_address: string;

    @Column({length: 20})
    externado_student_emergency_phone: string;

    @Column()
    externado_student_resp_type_id: number;

    @ManyToOne(() => ExternadoStudentResponsibleType, externadoStudRespType => externadoStudRespType.externadoStudent)
    @JoinColumn({name: "externado_student_resp_type_id"})
    externadoStudRespType: ExternadoStudentResponsibleType;

    @Column({length: 45})
    externado_student_rep_other: string

    @Column({length: 60})
    externado_student_rep_name: string;

    @Column()
    externado_student_rep_id_type: number;

    @Column({length: 20})
    externado_student_rep_id: string;

    @Column({length: 120})
    externado_student_rep_address: string;

    @Column({length: 20})
    externado_student_rep_homephone: string;

    @Column({length: 20})
    externado_student_rep_work_phone: string;

    @Column({length: 20})
    externado_student_rep_mobile_phone: string;

    @Column({length: 60})
    externado_student_rep_email: string;

    @Column({nullable: false, default: false})
    externado_proccess_finished: boolean;

    @Column({nullable: false, default: false})
    externado_form_valid: boolean;

    @Column({nullable: false, default: true})
    externado_student_active: boolean;

    @Column({nullable: false, default: false})
    externado_historical: boolean;
    
    @Column({nullable: false})
    externado_creation_datetime: Date;
}
