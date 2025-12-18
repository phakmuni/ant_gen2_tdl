import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { QueryNoteDto } from './dto/query-note.dto';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Note } from './entities/note.entity';
import { ResponseNoteDto } from './dto/response-note.dto';
import { getPaginationMeta, PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@Injectable()
export class NotesService {

  constructor(
      @InjectRepository(User) private readonly userRepo: Repository<User>,
      @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
      @InjectRepository(Note) private readonly noteRepo: Repository<Note>,
  ){}

  public async findAllByUserId(user: User,query: QueryNoteDto): Promise<PaginatedResponse<ResponseNoteDto>> {
      const {_page = 1, _per_page =10, search, isCompleted,sortBy, sortDir} = query; 
      const userId=user.id;
      const skip = (_page - 1) * _per_page;
      const queryBuilder = this.noteRepo
                          .createQueryBuilder('note')
                          .leftJoinAndSelect("note.user", "user")
                          .where('user.id = :id', { id:  userId })
                          .select([
                            'note.id',
                            'note.title',
                            'note.isCompleted',
                            'note.createdAt',
                            'note.updatedAt'
                          ])
                          .skip(skip).take(_per_page);
      if(search) queryBuilder.andWhere("(note.title LIKE :search )", {search: `%${search}%`});
      if(sortBy && sortDir) queryBuilder.orderBy("note."+sortBy, sortDir);
      if(isCompleted) queryBuilder.andWhere("(note.isCompleted = :isCompleted)", {isCompleted:isCompleted})
      const [items, totalItems] = await queryBuilder.getManyAndCount();
      return { items : plainToInstance(ResponseNoteDto, items, {excludeExtraneousValues: true}), meta: getPaginationMeta({_page, _per_page, totalItems})};
  }
   
  public async create(createNoteDto: CreateNoteDto,user:User):Promise<ResponseNoteDto> {
    const note = this.noteRepo.create({
      ...createNoteDto,
      user: user
    })
    return plainToInstance(ResponseNoteDto, await this.noteRepo.save(note), {excludeExtraneousValues: true});
  }

  public async findOne(id: number,user: User):Promise<ResponseNoteDto> {
    const note=await this.noteRepo.findOne({
      where:{ 
          id: id,
          user: { id: user.id }
      },
    })
    if (!note) throw new NotFoundException("This Note Id is not found or it isn't yours");
    return plainToInstance(ResponseNoteDto, note, {excludeExtraneousValues: true});
  }


  public async update(id: number,user: User, updateNoteDto: UpdateNoteDto):Promise<ResponseNoteDto> {
    const note=await this.noteRepo.findOne({
      where:{ 
          id: id,
          user: { id: user.id }
      },
    })
    if (!note) throw new NotFoundException("This Note Id is not found or it isn't yours");

    if(updateNoteDto.title!==undefined) note.title=updateNoteDto.title;
    if(updateNoteDto.content!==undefined) note.content=updateNoteDto.content;

    return plainToInstance(ResponseNoteDto, await this.noteRepo.save(note), {excludeExtraneousValues: true});

  }

  public async remove(id: number,user: User):Promise<{id:number}> {
    const note=await this.noteRepo.findOne({
      where:{ 
          id: id,
          user: { id: user.id }
      },
    })
    if (!note) throw new NotFoundException("This Note Id is not found or it isn't yours");
    return {id};
  }

  public async updateStatus(id: number,user: User):Promise<ResponseNoteDto> {
    const note=await this.noteRepo.findOne({
      where:{ 
          id: id,
          user: { id: user.id }
      },
    })
    if (!note) throw new NotFoundException("This Note Id is not found or it isn't yours");
    note.isCompleted=!note.isCompleted;
    return plainToInstance(ResponseNoteDto, await this.noteRepo.save(note), {excludeExtraneousValues: true});
  }

}
