import { ExternadoResponsible } from "src/externado_responsible/entities/externado_responsible.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class ExternadoIncoming {

    @Column({primary: true, unique: true, nullable: false})
    idexternado_incomings: number;

    @Column({unique: true, nullable: false, length: 45})
    externado_incomings_value: string;

    @OneToMany(() => ExternadoResponsible, externadoResponsible => externadoResponsible.externado_incomings_id)
    externadoResponsible: ExternadoResponsible;
    
}
