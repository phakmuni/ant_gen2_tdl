import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenerationDto } from './dto/create-generation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Generation } from './entities/generation.entity';
import { Repository } from 'typeorm';
import { ResponseGenerationDetailDto } from './dto/response-generation-detail.dto';
import { plainToInstance } from 'class-transformer';
import { Department } from 'src/department/entities/department.entity';
import { UpdateGenerationDto } from './dto/update-generation.dto';

@Injectable()
export class GenerationService {

   constructor(
           @InjectRepository(Generation) private readonly gRepo: Repository<Generation>,
           @InjectRepository(Department) private readonly dRepo: Repository<Department>
   ){}
    
    // --- PRIVATE UTILITY METHOD FOR YEAR VALIDATION ---
    private validateYears(startYear: number, endYear: number): void {
        const currentYear = new Date().getFullYear();

        if (startYear >= endYear) {
            throw new BadRequestException('Start year must be strictly less than the end year.');
        }

        if (startYear > currentYear || endYear > currentYear) {
            throw new BadRequestException('Generation years cannot be set in the future.');
        }
    }

   public async create(dto: CreateGenerationDto) {
        // 1. VALIDATION CHECK
        this.validateYears(dto.startYear, dto.endYear);
        
        // 2. Check for Department existence
           const d = await this.dRepo.findOneOrFail({where: {id: dto.departmentId}}).catch(() => {throw new NotFoundException("Department was not found")});
   
        // 3. Save and return
        return plainToInstance(ResponseGenerationDetailDto, await this.gRepo.save(this.gRepo.create({...dto, department: d})), {excludeExtraneousValues: true})
   }

   public async findOne(id: number) {
           return plainToInstance(ResponseGenerationDetailDto, await this.getOne(id), {excludeExtraneousValues: true});
   }
    
   public async delete(id: number) {
        // Ensure the generation exists
        const existing = await this.getOne(id); 
        
        // Count related AlumniProfiles using the Generation's foreign key
           const profilesCount = await this.gRepo.manager.count('AlumniProfile', { 
                   where: { generation: { id: existing.id } } // Use generation FK property
           });
           
           console.log(`Profiles count for generation ${id}: ${profilesCount}`);
           
           if(profilesCount > 0) throw new BadRequestException("Cannot delete in used generation. Related profiles exist.");
           
           await this.gRepo.delete(id);
           return [];
   }

   public async update(id: number, dto: UpdateGenerationDto) {
        // 1. Check existing generation and years
           const existing = await this.getOne(id); 

        const startYear = dto.startYear || existing.startYear;
        const endYear = dto.endYear || existing.endYear;
        
        // 2. VALIDATION CHECK on combined years
        this.validateYears(startYear, endYear);
        
        // 3. Handle Department ID change (if requested)// 4. Update the Generation
        await this.gRepo.update(id, dto); // Use gRepo and spread department if needed

        // 5. Return updated resource
        return this.findOne(id);
   }

   public async getOne(id: number){
        return await this.gRepo.findOneOrFail({where: {id}, relations: ["department"]}).catch(() => {throw new NotFoundException("Generation was not found.")})
   }
}