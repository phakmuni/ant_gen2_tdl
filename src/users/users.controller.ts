import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SuccessMessage } from 'src/common/decorators/success_message.decorator';
import { RoleEnum } from 'src/roles/constants/role.enum';
import { UserService } from './users.service';
import { QueryUserDto } from './dto/query-user.dto';
import { RequestChangeStatusDto } from './dto/request-change-status.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';
// import { CreateAlumniDto } from './dto/create-alumni.dto';

@Controller('users')
export class UsersController {

    constructor(
        private readonly userService : UserService
    ){}
    /**
     * * Retrieved all users
     */
    @Get() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(RoleEnum.ADMIN) @SuccessMessage("Retrieved users successful.")
    findAll(@Query() query: QueryUserDto) {
        return this.userService.findAll(query);
    }
    /**
     * * Retrieved a user
     */
    @Get(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(RoleEnum.ADMIN) @SuccessMessage("Retrieved a user successful.")
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    /**
     * * Change user status
     */
    @Put(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(RoleEnum.ADMIN) @SuccessMessage("Change user status successful.")
    changeStatus(@Param('id', ParseIntPipe) id: number, @Body() dto : RequestChangeStatusDto) {
        return this.userService.changeStatus(id, dto);
    }

    /** 
     * * Create user account
     */
    // @Post("/alumni/stu") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(RoleEnum.ADMIN) @SuccessMessage("Change user status successful.")
    // createAlumni (@Body() dto : CreateAlumniDto) {
    //     return this.userService.createAlumni(dto);
    // }

    // @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(RoleEnum.ADMIN) @SuccessMessage("Create user successful.")
    // create (@Body() dto : CreateAdminDto) {
    //     return this.userService.create(dto);
    // }

    @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(RoleEnum.ADMIN) @SuccessMessage("Create user successful.")
    create (@Body() dto : CreateUserDto) {
        return this.userService.create(dto);
    }

    

}