import { ExternadoResponsible } from "src/externado_responsible/entities/externado_responsible.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class ExternadoPep {

    @Column({primary: true, unique: true, nullable: false})
    idexternado_pep: number;

    @Column({unique: true, nullable: false, length: 45})
    externado_pep_value: string;

    @OneToMany(() => ExternadoResponsible, externadoResponsible => externadoResponsible.externado_pep_occupation_id)
    externadoResponsiblePEP: ExternadoResponsible;

    @OneToMany(() => ExternadoResponsible, externadoResponsible => externadoResponsible.externado_pep_3years_occupation_id)
    externadoResponsible3yearsPEP: ExternadoResponsible;

}
