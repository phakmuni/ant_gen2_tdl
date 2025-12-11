

import { AlumniProfile } from 'src/alumni-profile/entities/alumni-profile.entity';
import { Department } from 'src/department/entities/department.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity({name: 'generations'})
export class Generation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startYear: number;

  @Column()
  endYear: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Department, dept => dept.generations, {onDelete: "RESTRICT"})
  department: Department;

  @OneToMany(() => AlumniProfile, profile => profile.generation)
  profiles: AlumniProfile[];

}

