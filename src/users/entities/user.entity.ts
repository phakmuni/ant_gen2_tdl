
import { BaseEntity } from "src/database/entities/base.entity";
import { Role } from "src/roles/entities/role.entity";
import { Token } from "src/tokens/entities/token.entity";
import {  Column, Entity, Index, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { StatusEnum } from "../constants/status.enum";
import { Note } from "src/notes/entities/note.entity";
// import { AlumniProfile } from "src/alumni-profile/entities/alumni-profile.entity";


@Entity({ name: "users" })
export class User extends BaseEntity {
    @Column({length : 100})
    fullname: string;

    @Column({length : 255, default: "default-avatar.png"})
    avatar : string;

    @Column({ length: 255 })
    @Index({ unique: true })
    email: string;


    @Column({ length: 255, nullable: true })
    password: string;

    @Column({type: "enum", enum: StatusEnum, default: StatusEnum.ACTIVATED})
    status: StatusEnum;

    @Column({ type: 'varchar', nullable: true, unique: true })
    tempEmail?: string | null;

    @Column({ default: true })
    isVerifyEmail: boolean;
    
    // @Column({ type: 'varchar', nullable: true })
    // emailChangeToken?: string | null;

    // @Column({ type: 'datetime', nullable: true })
    // emailChangeTokenExpiresAt?: Date | null;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    role: Role;

    @OneToMany(() => Token, (token) => token.user)
    tokens: Token[];

    @OneToMany(()=>Note,(notes)=>notes.user)
    notes:Note[];

}
