import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { TokenService } from 'src/tokens/tokens.service';
import { User } from 'src/users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { RequestLoginDto } from './dto/request-login.dto';
import * as bcrypt from 'bcrypt'
import * as fs from 'fs'
import { ResponseLoginDto } from './dto/response-login.dto';
import { plainToInstance } from 'class-transformer';
import { RequestRegisterDto } from './dto/request-register.dto';
import { RoleEnum } from 'src/roles/constants/role.enum';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { StatusEnum } from 'src/users/constants/status.enum';
import * as path from 'path';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';
import { RequestChangePasswordDto } from './dto/request-change-password.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import * as nodemailer from 'nodemailer';
import { renderResetPasswordHtml } from 'src/utils/html/reset-password.html';
import { RequestForgetPasswordDto } from './dto/request-forgot-password.dto';
import { randomBytes, randomUUID } from 'crypto';
import { ResetPasswordToken } from 'src/reset-password-token/entities/reset-password-token.entity';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { RequestChangeEmailDto } from './dto/request-change-email.dto';
import { renderChangeEmailHtml } from 'src/utils/html/change-email.html';
import { EmailVerificationToken } from 'src/email-verification-token/entities/email-verification-token.entity';
import { RequestDeleteAccountDto } from './dto/request-delete-account.dto';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        // @InjectRepository(AlumniProfile) private readonly apRepo: Repository<AlumniProfile>,
        // @InjectRepository(Department) private readonly dRepo: Repository<Department>,
        // @InjectRepository(Generation) private readonly gRepo: Repository<Generation>,
        @InjectRepository(ResetPasswordToken) private readonly rsptRepo: Repository<ResetPasswordToken>,
        @InjectRepository(EmailVerificationToken) private readonly eftRepo: Repository<EmailVerificationToken>,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ){}

    
    public async existingByEmail (email: string):Promise<boolean> {
        return this.userRepo.exists({where: {email}});
    }

    public async login (dto: RequestLoginDto) {
        const user: User = await this.userRepo.findOneOrFail({where: {email: dto.email}}).catch(() => { throw new UnauthorizedException("Invalid email or password.") });
        // if(user.status == StatusEnum.BANNED) throw new ForbiddenException("User's account has been banned.");
        if(!await bcrypt.compare(dto.password, user.password)) throw new UnauthorizedException("Invalid email or password.");
        if(!user.isVerifyEmail) throw new UnauthorizedException("User's account haven't verify yet, please check OTP to verify!");
        const token = this.generateToken(user);
        await this.tokenService.storeToken(user, token);
        const result = plainToInstance(
            ResponseLoginDto,
            { user, token: token },
            { excludeExtraneousValues: true }
        );
        return { ...result, __customMessage: "Login successful!" };
    }

    private generateToken(user: User) : string{
        const payload = {
            sub : user.id
        };
        const secret = this.configService.get<string>('SECRET_KEY');
        return this.jwtService.sign(payload, {
            secret : secret,
            expiresIn: '7d'
        })
    }

    public async register(dto: RequestRegisterDto) {

        // Check duplicate email
        if (await this.userRepo.exists({
            where: [{ email: dto.email }, { tempEmail: dto.email }],
        })) {
            throw new ConflictException("Email is already in use.");
        }

        // Get USER role
        const role = await this.roleRepo.findOneOrFail({
            where: { name: RoleEnum.USER },
        }).catch(() => {
            throw new InternalServerErrorException("USER role missing.");
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create user
        const user = this.userRepo.create({
            fullname:dto.fullname,
            email: dto.email,
            password: hashedPassword,
            role,
            isVerifyEmail: false,   //  Email not verified until OTP
        });

        const savedUser = await this.userRepo.save(user);

        return plainToInstance(
            ResponseRegisterDto,
            savedUser,
            { excludeExtraneousValues: true }
        );

    }

    public async updateAvatar(id: number, file: Express.Multer.File) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User was not found');

        // Remove old avatar if exists
        if (user.avatar && user.avatar != "default-avatar.png") {
            const oldPath = path.join(__dirname, '..', '..', 'uploads', 'avatars', user.avatar);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath); // Delete old file
            }
        }
        user.avatar = file.filename;
        return plainToInstance(ResponseUserDto, await this.userRepo.save(user), {excludeExtraneousValues: true});
    }

    public async deleteAvatar(id: number) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        // Remove old avatar if exists
        if (user.avatar) {
            if(user.avatar == "default-avatar.png") throw new BadRequestException("Default avatar cannot delete.")
            const oldPath = path.join(__dirname, '..', '..', 'uploads', 'avatars', user.avatar);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        user.avatar = "default-avatar.png";
        return plainToInstance(ResponseUserDto, await this.userRepo.save(user), {excludeExtraneousValues: true});
    }


    public async profile(user: User) {
        const profile = await this.userRepo.findOneOrFail({where: {id: user.id}}).catch(() => { throw new NotFoundException("User profile not found.") });
        // user.profile = load;
        const result = plainToInstance(ResponseUserDto, profile, {excludeExtraneousValues: true});
        // result.profile.generation = load.generation
        return result;
    }

    public async logout (token: string) {
        await this.tokenService.deleteToken(token);
        return [];
    }

    public async deleteAccount(user:User,dto:RequestDeleteAccountDto){
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Invalid password.');
        }
        await this.userRepo.delete(user.id);
        return [];
    }



    public async changePassword(dto: RequestChangePasswordDto, user: User): Promise<[]> {
        const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException('Invalid current password.');
        }
        if (dto.currentPassword === dto.newPassword) {
             throw new BadRequestException('New password must be different from current password.');
        }
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepo.save(user);
        await this.tokenService.deleteAllTokensForUser(user.id);
        return [];
    }


    // Inside your AuthService

    public async updateProfile(dto: UpdateUserProfileDto, user: User) {
        const profileUpdate: any = {};
        if (dto.fullname !== undefined) profileUpdate.fullname = dto.fullname;
        
        await this.userRepo.update(user.id, profileUpdate);
        
        // --- 4. Fetch and Return Updated Data ---

        // Fetch the updated user data to return a fresh response
        const updatedUser = await this.userRepo.findOne({ 
            where: { id: user.id }
            // Ensure relations are loaded for the ResponseUserDto
            // relations: ['profile', 'profile.department', 'profile.generation', 'role'] 
        });
        
        return plainToInstance(ResponseUserDto, updatedUser, { excludeExtraneousValues: true });
    }


        /**
     * * Forget Password
     */

    private async sendResetPasswordEmail(email: string, fullname: string, resetLink: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: Number(this.configService.get('SMTP_PORT')),
            secure: false, // true if using port 465, false for 587
            auth: {
                user: this.configService.get('SMTP_MAIL'),
                pass: this.configService.get('SMTP_PASSWORD'),
            },
        });

        try {
            await transporter.sendMail({
                from: `"ANT" <${this.configService.get('SMTP_MAIL')}>`,
                to: email,
                subject: 'Password Reset Request',
                // Use the new reset password HTML template
                html: renderResetPasswordHtml(fullname, resetLink),
            });
        } catch (error) {
            console.error('Email sending failed:', error);
            // Decide how to handle email failure (e.g., log and continue, or throw)
            // For password reset, it's safer to throw if we can't notify the user.
            throw new InternalServerErrorException('Failed to send password reset email.');
        }
    }
    // service.ts

    public async forgetPassword(dto: RequestForgetPasswordDto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });

        // prevent email enumeration
        if (!user) return [];

        if (!user.isVerifyEmail) {
            throw new ForbiddenException("This account hasn't verified email yet.");
        }

        // Remove previous reset tokens for this user
        await this.rsptRepo.delete({ user: { id: user.id } });

        // Generate token
        const rawToken = randomUUID();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        const resetTokenEntity = this.rsptRepo.create({
            user,
            token: await bcrypt.hash(rawToken, 10),
            expires: expiresAt,
            isUsed: false,
        });

        await this.rsptRepo.save(resetTokenEntity);

        const frontendUrl =
            this.configService.get('FRONTEND_URL') || 'http://localhost:3000';

        // The reset link contains only the raw token
        const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

        await this.sendResetPasswordEmail(
            user.email,
            user.fullname,
            resetLink,
        );
        return [];
    }



    public async resetPassword(dto: RequestResetPasswordDto): Promise<void> {
        const { newPassword, token: rawToken } = dto;

        const now = new Date();

        // find all tokens of this user that are not expired and not used
        const tokens = await this.rsptRepo.find({
            where: { isUsed: false, expires: MoreThan(now) },
            relations: ['user'],
        });

        if (!tokens.length) {
            throw new ForbiddenException("Invalid or expired password reset token.");
        }

        // Find matching token by comparing hashes
        let resetRecord: ResetPasswordToken | undefined;

        for (const t of tokens) {
            if (await bcrypt.compare(rawToken, t.token)) {
            resetRecord = t;
            break;
            }
        }

        if (!resetRecord) {
            throw new ForbiddenException("Invalid or expired password reset token.");
        }

        // Token is valid - mark it used
        resetRecord.isUsed = true;
        await this.rsptRepo.save(resetRecord);

        // Change password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        resetRecord.user.password = newHashedPassword;
        await this.userRepo.save(resetRecord.user);

        // Force logout
        await this.tokenService.deleteAllTokensForUser(resetRecord.user.id);

        // Remove all reset tokens of this user (cleanup)
        await this.rsptRepo.delete({ user: { id: resetRecord.user.id } });
    }


    private async sendChangeEmailVerificationMail(
        newEmail: string,
        html:string,
        ): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: Number(this.configService.get('SMTP_PORT')),
            secure: false,
            auth: {
            user: this.configService.get('SMTP_MAIL'),
            pass: this.configService.get('SMTP_PASSWORD'),
            },
        });

        try {
            await transporter.sendMail({
            from: `"ANT" <${this.configService.get('SMTP_MAIL')}>`,
            to: newEmail,
            subject: 'Confirm your new email address',
            html: html
            });
        } catch (error) {
            console.error('Change email verification email failed:', error);
            throw new InternalServerErrorException(
            'Failed to send change email verification.',
            );
        }
    }


    public async changeEmail(dto: RequestChangeEmailDto, user: User) {
        const { newEmail, password } = dto;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid password.');

        if (newEmail === user.email) {
            throw new BadRequestException('New email must be different from current email.');
        }

        const existingUser = await this.userRepo.findOne({
            where: [{ email: newEmail }, { tempEmail: newEmail }],
        });
        if (existingUser) throw new BadRequestException('This email is already in use.');

        // Delete old change-email tokens
        await this.eftRepo.delete({ user: { id: user.id } });

        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        user.tempEmail = newEmail;

        const entity = this.eftRepo.create({
            user,
            token: await bcrypt.hash(token, 10),
            expires: expiresAt,
            isUsed: false,
        });
        await this.eftRepo.save(entity);

        await this.userRepo.save(user);

        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const verifyLink = `${frontendUrl}/verify-change-email?token=${token}`;

        const html = renderChangeEmailHtml(user.fullname, newEmail, verifyLink);
        await this.sendChangeEmailVerificationMail(newEmail, html);

        return { email: newEmail };
    }

    public async verifyChangeEmail(token: string) {
        const now = new Date();
        const tokens = await this.eftRepo.find({
            where: { isUsed: false, expires: MoreThan(now) },
            relations: ['user'],
        });

        if (!tokens.length) throw new ForbiddenException("Invalid or expired email-change token.");

        let record: EmailVerificationToken | undefined;
        for (const t of tokens) {
            if (await bcrypt.compare(token, t.token)) {
            record = t;
            break;
            }
        }
        if (!record) throw new ForbiddenException("Invalid or expired email-change token.");

        record.isUsed = true;
        await this.eftRepo.save(record);

        // console.log("=======================================");
        // console.log(record);
        // console.log(record.user);
        // console.log(record.user.tempEmail);

        record.user.email = record.user.tempEmail || record.user.email;
        record.user.tempEmail = null;
        await this.userRepo.save(record.user);

        await this.tokenService.deleteAllTokensForUser(record.user.id);

        // cleanup
        await this.eftRepo.delete({ user: { id: record.user.id } });

        return plainToInstance(ResponseUserDto, record.user, { excludeExtraneousValues: true });
        }

}
