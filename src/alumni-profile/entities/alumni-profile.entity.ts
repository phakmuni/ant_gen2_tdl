

import { Department } from 'src/department/entities/department.entity';
import { Generation } from 'src/generation/entities/generation.entity';
import { StatusEnum } from 'src/users/constants/status.enum';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
// import { User } from './user.entity';
// import { Generation } from './generation.entity';
// import { GroupMembership } from './group-membership.entity';
// import { EventRegistration } from './event-registration.entity';
// import { Donation } from './donation.entity';

@Entity({ name: "alumni_profiles" })
export class AlumniProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User;

    @Column()
    fullname: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    currentJob: string;

    @Column({ length: 255, default: "default-avatar.png" })
    avatar: string;

    @Column({
        type: "enum",
        enum: StatusEnum,
        default: StatusEnum.PENDING
    })
    status: StatusEnum;

    @ManyToOne(() => Department, dept => dept.profiles, {
        eager: true,
        nullable: true
    })
    @JoinColumn({ name: 'departmentId' })
    department: Department;

    @ManyToOne(() => Generation, gen => gen.profiles, {
        nullable: true,
        eager: true
    })
    @JoinColumn({ name: 'generationId' })
    generation: Generation;
}

