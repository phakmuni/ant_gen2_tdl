import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SuccessMessage } from 'src/common/decorators/success_message.decorator';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/roles/constants/role.enum';
import { QueryDepartmentDto } from './dto/query-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentController {

    constructor(
        private readonly dService : DepartmentService
    ){}

    /** 
     * TODO: Require role and auth
    * */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @SuccessMessage("Created department successful.")
    public async create(@Body() dto: CreateDepartmentDto) {
        return this.dService.create(dto);
    }

    @Put(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @SuccessMessage("Updated department successful.")
    public async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDepartmentDto) {
        return this.dService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @SuccessMessage("Deleted department successful.")
    public async delete(@Param('id', ParseIntPipe) id: number) {
        return this.dService.delete(id);
    }

    @Get(":id")
    @SuccessMessage("Retrieved department successful.")
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.dService.findOne(id);
    }

    @Get()
    @SuccessMessage("Retrieved departments successful.")
    public async findAll(@Query() query: QueryDepartmentDto) {
        return this.dService.findAll(query);
    }


}
