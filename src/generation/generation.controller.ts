import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { SuccessMessage } from 'src/common/decorators/success_message.decorator';
import { CreateGenerationDto } from './dto/create-generation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/roles/constants/role.enum';
import { UpdateGenerationDto } from './dto/update-generation.dto';

@Controller('generations')
export class GenerationController {

    constructor(
        private readonly gService: GenerationService
    ){}

    /** 
     * TODO: Require role and auth
    * */
    @Post()
    @SuccessMessage("Created generation successful.")
    public async create(@Body() dto: CreateGenerationDto) {
        return this.gService.create(dto);
    }

    @Put(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @SuccessMessage("Updated generation successful.")
    public async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGenerationDto) {
        return this.gService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @SuccessMessage("Deleted generation successful.")
    public async delete(@Param('id', ParseIntPipe) id: number) {
        return this.gService.delete(id);
    }

    @Get(":id")
    @SuccessMessage("Retrieved department successful.")
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.gService.findOne(id);
    }

}
