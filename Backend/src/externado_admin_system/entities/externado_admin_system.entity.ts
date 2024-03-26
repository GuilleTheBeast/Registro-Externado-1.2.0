import { Column, Entity } from "typeorm";

@Entity()
export class ExternadoAdminSystem {
    @Column({primary: true, unique: true, nullable: false})
    idexternado_admin_system: number;

    @Column({unique: true, nullable: false, length: 60})
    externado_generic_pass: string;

    @Column({nullable: false, length: 60})
    externado_range_period: string;

    @Column({nullable: false, default: 1})
    externado_active_period: boolean;

    @Column({nullable: false, default: 1})
    externado_system_closed: boolean;

}
