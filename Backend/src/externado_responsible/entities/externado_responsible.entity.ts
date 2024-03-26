import { ExternadoDepartment } from "src/externado_department/entities/externado_department.entity";
import { ExternadoIncoming } from "src/externado_incomings/entities/externado_incoming.entity";
import { ExternadoPep } from "src/externado_pep/entities/externado_pep.entity";
import { ExternadoResponsibleType } from "src/externado_responsible_type/entities/externado_responsible_type.entity";
import { ExternadoUser } from "src/externado_users/entities/externado_user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class ExternadoResponsible {
    @Column({primary: true, unique: true, nullable: false})
    idexternado_responsible: number;

    @Column({ unique: true, nullable: false})
    externado_user_id: number;

    @ManyToOne(() => ExternadoUser, externadoUser => externadoUser.responsible)
    @JoinColumn({name: "externado_user_id"})
    externadoUser: ExternadoUser;

    @Column({length: 60})
    externado_firstname: string;

    @Column({length: 60})
    externado_lastname: string;

    @Column()
    externado_birthdate: Date;

    @Column()
    externado_id_type: boolean;

    @Column({length: 20})
    externado_id: string;

    @Column({length: 20})
    externado_nit: string;

    @Column({length: 30})
    externado_nationality: string;

    @Column({length: 120})
    externado_address: string;

    @Column({length: 30})
    externado_town: string;

    @Column()
    externado_department_id: number;

    @ManyToOne(() => ExternadoDepartment, externadoDepartment => externadoDepartment.externadoResponsible)
    @JoinColumn({name: "externado_department_id"})
    externadoDepartment: ExternadoDepartment;

    @Column({length: 20})
    externado_work_phone: string;

    @Column({length: 20})
    externado_mobile_phone: string;

    @Column({length: 60})
    externado_email: string;

    @Column({length: 120})
    externado_occupation: string;

    @Column({length: 120})
    externado_workplace: string;

    @Column({length: 120})
    externado_jobposition: string;

    @Column()
    externado_pep: boolean;

    @Column()
    externado_pep_occupation_id: number;

    @ManyToOne(() => ExternadoPep, externadoPEP => externadoPEP.idexternado_pep)
    @JoinColumn({name: "externado_pep_occupation_id"})
    externadoPEP: ExternadoPep;

    @Column({length: 120})
    externado_pep_occupation_other: string;

    @Column()
    externado_pep_3years: boolean;

    @Column()
    externado_pep_3years_occupation_id: number;

    @ManyToOne(() => ExternadoPep, externadoPEP => externadoPEP.idexternado_pep)
    @JoinColumn({name: "externado_pep_3years_occupation_id"})
    externado3yearsPEP: ExternadoPep;

    @Column({length: 120})
    externado_pep_3years_occupation_other: string;

    @Column()
    externado_incomings_id: number;

    @ManyToOne(() => ExternadoIncoming, externadoIncoming => externadoIncoming.idexternado_incomings)
    @JoinColumn({name: "externado_incomings_id"})
    externadoIncomings: ExternadoIncoming;

    @Column({length: 120})
    externado_incomings_other: string;

    @Column()
    externado_former_externado_student: boolean;

    @Column({length: 120})
    externado_university_studies: string;

    @Column({length: 45})
    externado_responsible_relationship: string;

    @Column({nullable: false, default: false})
    externado_direct_responsible: boolean;

    @Column({nullable: false})
    externado_responsible_type_id: number;

    @ManyToOne(() => ExternadoResponsibleType, externadoRespType => externadoRespType.externadoResponsible)
    @JoinColumn({name: "externado_responsible_type_id"})
    externadoRespType: ExternadoResponsibleType;

    @Column({nullable: false, default: false})
    externado_form_valid: boolean;

    @Column({nullable: false, default: true})
    externado_active: boolean;

    @Column({nullable: false, default: false})
    externado_historical: boolean;
    
    @Column({nullable: false})
    externado_creation_datetime: Date;
    
}
