import { ExternadoUser } from "src/externado_users/entities/externado_user.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class ExternadoAdmin {

    @Column({ primary: true, unique: true, nullable: false})
    externado_user_id: number;

    @OneToOne(() => ExternadoUser)
    @JoinColumn({name: "externado_user_id"})
    externadoUser: ExternadoUser;

    @Column({unique: true, nullable: false, length: 60})
    externado_admin_firstname: string;

    @Column({nullable: false, length: 60})
    externado_admin_lastname: string;

    @Column({nullable: false, length: 45})
    externado_carnet: string;

    @Column({nullable: false, default: 1})
    externado_admin_active: boolean;

    @Column({nullable: false})
    externado_creation_datetime: Date;

}
