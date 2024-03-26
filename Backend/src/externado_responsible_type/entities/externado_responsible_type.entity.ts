import { ExternadoResponsible } from "src/externado_responsible/entities/externado_responsible.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class ExternadoResponsibleType {
    @Column({primary: true, unique: true, nullable: false})
    idexternado_responsible_type: number;

    @Column({nullable: false, length: 45})
    externado_responsible_type: string;

    @OneToMany(() => ExternadoResponsible, externadoResponsible => externadoResponsible.externadoRespType)
    externadoResponsible: ExternadoResponsible;
}
