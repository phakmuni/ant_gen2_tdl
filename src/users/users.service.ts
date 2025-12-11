import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateAlumniDto } from './dto/create-alumni.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { RequestChangeStatusDto } from './dto/request-change-status.dto';

@Injectable()
export class UserService {

    constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>
  ){}
  
    public async getUserById(id: number): Promise<User> {
        return await this.userRepo.findOneOrFail({where: {id}}).catch(() => {throw new UnauthorizedException("invalid email or password.");});
    } 

    // TODO: Haven't finish start this yet

  public async findAll(query: QueryUserDto) {
    const {_page = 1, _per_page =10, search, status,sortBy, sortDir} = query; 
    const skip = (_page - 1) * _per_page;
    const queryBuilder = this.userRepo
                        .createQueryBuilder('user')
                        .leftJoinAndSelect("user.role", "role")
                        .select([
                          'user.id',
                          'user.fullname',
                          'user.email',
                          'user.avatar',
                          'user.status',
                          'user.phoneNumber',
                          'user.telegramLink',
                          'user.createdAt',
                          'role.id',
                          'role.name',
                        ])
                        .skip(skip).take(_per_page);
    if(search) queryBuilder.andWhere("(user.fullname LIKE :search OR user.email LIKE :search OR user.phoneNumber LIKE :search OR user.telegramLink LIKE :search)", {search: `%${search}%`});
    if(sortBy && sortDir) queryBuilder.orderBy("user."+sortBy, sortDir);
    if(status) queryBuilder.andWhere("(user.status = :status)", {status: status})
    const [items, totalItems] = await queryBuilder.getManyAndCount();
    return { items : plainToInstance(ResponseUserDto, items, {excludeExtraneousValues: true}), meta: getPaginationMeta({_page, _per_page, totalItems})};
  }

  public async findOne(id: number) {
    return plainToInstance(ResponseUserDto, await this.getUserById(id), {excludeExtraneousValues: true});
  }

  public async changeStatus(id: number, dto: RequestChangeStatusDto): Promise<ResponseUserDto> {
      const user = await this.userRepo.findOneOrFail({where: {id}}).catch(() => {throw new NotFoundException("User was not found.")});
      if(user.id == 1) throw new ForbiddenException("Not allowed to make any action on default admin.");
      if(dto.status) user.profile.status = dto.status;
      return plainToInstance(ResponseUserDto, await this.userRepo.save(user), {excludeExtraneousValues: true});
  }

  public async create(dto: CreateAdminDto) {
    return plainToInstance(ResponseUserDto, await this.userRepo.save(toSave), {excludeExtraneousValues :true})
  }

  public async createAlumni(dto: CreateAlumniDto) {
    return plainToInstance(ResponseUserDto, await this.userRepo.save(toSave), {excludeExtraneousValues :true})
  }
}
