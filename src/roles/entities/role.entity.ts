import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "roles"})
export class Role {
    @PrimaryGeneratedColumn()
    id:  number;
    
    @Column({length : 255, unique : true})
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}