
import { BaseEntity } from "src/database/entities/base.entity";
import { Role } from "src/roles/entities/role.entity";
import { Token } from "src/tokens/entities/token.entity";
import {  Column, Entity, Index, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AlumniProfile } from "src/alumni-profile/entities/alumni-profile.entity";


@Entity({ name: "users" })
export class User extends BaseEntity {

    @Column({ length: 255 })
    @Index({ unique: true })
    email: string;

    @Column({ name: 'temp_email', type: 'varchar', length: 255, nullable: true })
    @Index({ unique: true })
    tempEmail?: string | null;


    @Column({ length: 255, nullable: true })
    password: string;

    @Column({ default: true })
    isVerifyEmail: boolean;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    role: Role;

    @OneToMany(() => Token, (token) => token.user)
    tokens: Token[];

    @OneToOne(() => AlumniProfile, (profile) => profile.user, {
        eager: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    profile: AlumniProfile;
}
