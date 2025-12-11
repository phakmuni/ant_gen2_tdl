import { Controller, Get, NotFoundException, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SuccessMessage } from 'src/common/decorators/success_message.decorator';

@Controller('roles')
export class RolesController {

    constructor(
        @InjectRepository(Role) private readonly roleRepo : Repository<Role> 
    ){}

    @Get()
    @UseGuards(JwtAuthGuard)
    @SuccessMessage("Retrieved roles successful.")
    public async findAll(){
        return this.roleRepo.find();
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @SuccessMessage("Retrieved role successful.")
    public async findOne(@Param('id', ParseIntPipe) id: number){
        return this.roleRepo.findOneOrFail({where: {id}}).catch(() => {throw new NotFoundException("Role was not found.")})
    }

}
