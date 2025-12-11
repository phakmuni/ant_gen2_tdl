

import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity({ name: 'email_verification_token' })
export class EmailVerificationToken {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    token: string;

    @Column()
    expires: Date;

    @Column({default: false})
    isUsed: boolean;

    @CreateDateColumn()
    createdAt: Date;

}