
import { CreateDateColumn, PrimaryGeneratedColumn, BaseEntity as TypeOrmBaseEntity, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;    

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}