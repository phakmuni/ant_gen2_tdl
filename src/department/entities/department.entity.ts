import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "src/database/entities/base.entity";
import { Generation } from "src/generation/entities/generation.entity";
import { AlumniProfile } from "src/alumni-profile/entities/alumni-profile.entity";

@Entity({name: "departments"})
export class Department extends BaseEntity {
  
  @Column({ unique: true })
  name: string; // Example: "Computer Science"

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Generation, generation => generation.department, {eager: true})
  generations: Generation[];

  @OneToMany(() => AlumniProfile, profile => profile.department)
  profiles: AlumniProfile[];
}
