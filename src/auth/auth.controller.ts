
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, MaxFileSizeValidator, ParseFilePipe, Post, Put, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessMessage } from 'src/common/decorators/success_message.decorator';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestLoginDto } from './dto/request-login.dto';
import { RequestRegisterDto } from './dto/request-register.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { RequestForgetPasswordDto } from './dto/request-forgot-password.dto';
import { RequestChangePasswordDto } from './dto/request-change-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { RequestChangeEmailDto } from './dto/request-change-email.dto';
import { Throttle } from '@nestjs/throttler';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly service: AuthService,
    ){}

    /**
     * * authentication
     */
    @Post("/login")
    @HttpCode(200)
    public async login(@Body() dto: RequestLoginDto) {
        return await this.service.login(dto);
    }

    @Post("/register")
    @SuccessMessage("Register successful, please verify your email!")
    public async register(@Body() dto: RequestRegisterDto) {
        return await this.service.register(dto);
    }

    @Delete("logout")
    @SuccessMessage("Logout successful.")
    @UseGuards(JwtAuthGuard)
    public async logout (@Req() req: Request){
        const token = req.headers["authorization"]?.substring(7);
        if(!token) throw new UnauthorizedException("Unauthorized, you need to login!");
        return this.service.logout(token);
    }


    /**
      * * authentication / profile
      */
    @Get("profile")
    @SuccessMessage("Retrieved profile successful.")
    @UseGuards(JwtAuthGuard)
    public async profile (@CurrentUser() user: User) {
        return this.service.profile(user);
    }   


    /**  
     * TODO: Change email, forgot password, change password
     */

    
    @SuccessMessage("Updated profile successful!")
    @UseGuards(JwtAuthGuard)
    @Put("/profile")
    public async updateProfile (@Body() dto: UpdateUserProfileDto, @CurrentUser() user: User ){
        return this.service.updateProfile(dto, user);
    }

//     /**
//      * * authentication / profile / avatar
//      */
    @Put('/profile/avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    @UseGuards(JwtAuthGuard)
    async uploadAvatar(
        @CurrentUser() user: User,
        @UploadedFile(
            new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                maxSize: 1 * 1024 * 1024,
                message: 'Avatar must not exceed 1MB.',
                }),
            ],
            fileIsRequired: true,
            }),
        )
        avatar: Express.Multer.File,
        ) {
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(avatar.mimetype)) {
            throw new BadRequestException('Only JPG, PNG, GIF files are allowed.');
        }
        return this.service.updateAvatar(user.id, avatar);
    }

    @Delete('/profile/avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    @UseGuards(JwtAuthGuard)
    async deleteAvatar(
        @CurrentUser() user: User,
    ) {
        return this.service.deleteAvatar(user.id);
    }

    // TODO: change password, forget password
    /**
     * * authentication / password
     */
    @Put('/change-password') 
    @SuccessMessage('Password changed successfully.')
    @UseGuards(JwtAuthGuard) 
    public async changePassword(@Body() dto: RequestChangePasswordDto, @CurrentUser() user: User) { 
        return this.service.changePassword(dto, user); 
    }


    @Throttle({
        default: {
          limit: 5,      // 3 requests
          ttl: 60_000,   // per 60 seconds
        },
      })
    @Post('/forget-password') 
    @SuccessMessage('If a user exists with that email, a password reset link has been sent.')
    public async forgetPassword(@Body() dto: RequestForgetPasswordDto) { 
        return this.service.forgetPassword(dto);
    }



    @Post('/reset-password') 
    @SuccessMessage('Password reset successfully..')
    public async resetPassword(@Body() dto: RequestResetPasswordDto) { 
        return this.service.resetPassword(dto);
    }

//     /**
//      * ! Change email: Need to think how to implement
//      */
    @Throttle({
        default: {
          limit: 5,      // 3 requests
          ttl: 60_000,   // per 60 seconds
        },
      })
    @Post('/change-email') 
    @SuccessMessage('Email changed successfully, please check your Email to verify.')
    @UseGuards(JwtAuthGuard)
    public async changeEmail(@Body() dto: RequestChangeEmailDto, @CurrentUser() user: User) { 
        return this.service.changeEmail(dto, user);
    }

    @Post('/verify-change-email')
    @SuccessMessage('Email updated successfully.')
        public async verifyChangeEmail(@Body('token') token: string) {
        return this.service.verifyChangeEmail(token);
    }

}
