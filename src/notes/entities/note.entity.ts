import { BaseEntity } from "src/database/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({ name:"notes" })
export class Note extends BaseEntity{
    @Column({type:'varchar',length:255})
    title:string;

    @Column({type:'longtext',nullable: true})
    content:string;

    @Column({type:'boolean',default:false})
    isCompleted:boolean;

    @ManyToOne(()=>User,(user)=>user.notes,{onDelete:'CASCADE'})
    user:User;
}

