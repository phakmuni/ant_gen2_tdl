

import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity({ name: 'reset_password_token' })
export class ResetPasswordToken {
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