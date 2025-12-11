import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ResponseDepartmentDetailDto } from './dto/response-department.detail.dto';
import { QueryDepartmentDto } from './dto/query-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { getPaginationMeta } from 'src/common/interfaces/paginated-response.interface';

@Injectable()
export class DepartmentService {

    constructor(
        @InjectRepository(Department) private readonly dRepo: Repository<Department>
    ){}

    public async create(dto: CreateDepartmentDto) {
        return plainToInstance(ResponseDepartmentDetailDto, await this.dRepo.save(this.dRepo.create(dto)), {excludeExtraneousValues: true})
    }
    public async findAll(query: QueryDepartmentDto) {
        const {_page = 1, _per_page =10, search, sortBy, sortDir} = query; 
        const skip = (_page - 1) * _per_page;
        const queryBuilder = this.dRepo.createQueryBuilder('dept')
                            .select([
                            'dept.id',
                            'dept.name',
                            'dept.description',
                            'dept.createdAt',
                            'dept.updatedAt'
                            ])
                            .skip(skip).take(_per_page);
        if(search) queryBuilder.andWhere("(dept.name LIKE :search OR dept.description LIKE :search)", {search: `%${search}%`});
        if(sortBy && sortDir) queryBuilder.orderBy("dept."+sortBy, sortDir);
        const [items, totalItems] = await queryBuilder.getManyAndCount();
        return {items, meta: getPaginationMeta({_page, _per_page, totalItems})};
  }
    public async findOne(id: number) {
        return plainToInstance(ResponseDepartmentDetailDto, await this.getOne(id), {excludeExtraneousValues: true})
    }

    // DepartmentService.ts

    // ... (No need for the 'relations' array, just check existence)
    public async delete(id: number) {
        const dept = await this.dRepo.findOne({where: {id}}); // Load department, NO relations
        if(!dept) throw new NotFoundException("Department was not found.");
        // Perform a lightweight check for dependent records in the database
        const generationsCount = await this.dRepo.manager.count('Generation', { 
            where: { department: { id } } // Assuming foreign key is department: { id }
        });
        const profilesCount = await this.dRepo.manager.count('AlumniProfile', { 
            where: { department: { id } } // Assuming foreign key is department: { id }
        });
        if(generationsCount > 0 || profilesCount > 0) {
            throw new BadRequestException("Cannot delete in used department. Related generations or profiles exist.");
        }
        await this.dRepo.delete(id);
        return []; // Return empty array or void, not a literal '[]'
    }
    // DepartmentService.ts
    public async update(id: number, dto: UpdateDepartmentDto) {
        // 1. Ensure the record exists (throws NotFoundException via getOne)
        const dept = await this.getOne(id); 

        if(dto.name &&dto.name !=dept.name) if(await this.dRepo.exists({where: {name: dto.name}})) throw new ConflictException("Department name already existed.")

        // 2. Update ONLY the fields present in the DTO directly on the database
        // This is safer and more efficient.
        await this.dRepo.update(id, dto);

        // 3. Return the updated resource, not just the ID.
        // This is the standard API pattern for PUT/PATCH.
        return plainToInstance(ResponseDepartmentDetailDto, await this.findOne(id), {excludeExtraneousValues: true});
    }

    public async getOne (id: number) {
         const dept = await this.dRepo.findOne({where: {id}});
        if(!dept) throw new NotFoundException("Department was not found.");
        return dept;
    }


    
}
