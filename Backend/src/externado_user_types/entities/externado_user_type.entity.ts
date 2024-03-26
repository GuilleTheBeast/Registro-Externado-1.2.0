import { ExternadoUser } from "src/externado_users/entities/externado_user.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class ExternadoUserType {
    @Column({primary: true, unique: true, nullable: false})
    idexternado_user_type: number;

    @Column({nullable: false, length: 15})
    externado_user_type: string;

    @OneToMany(() => ExternadoUser, externadoUser => externadoUser.externado_user_type_id)
    externadoUser: ExternadoUser;
}
