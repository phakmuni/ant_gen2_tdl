import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { Repository } from 'typeorm';
import { renderRegisterOtpHtml } from 'src/utils/html/register.opt.html';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { StatusEnum } from 'src/users/constants/status.enum';
import { AlumniProfile } from 'src/alumni-profile/entities/alumni-profile.entity';
import { Otp } from './entities/otp.entity';

@Injectable()
export class OtpsService {
    constructor(
        @InjectRepository(Otp)
        private readonly otpRepo: Repository<Otp>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(AlumniProfile)
        private readonly alumniRepo: Repository<AlumniProfile>
    ) {}

    // ============================
    // Generate OTP
    // ============================
    async generateOtp(email: string) {
        const user = await this.userRepo.findOne({
            where: { email },
            relations: ['profile'],
        });

        if (!user) throw new NotFoundException("User was not found.");

        if (user.isVerifyEmail)
            throw new BadRequestException("Email already verified.");

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const hashedOtp = await bcrypt.hash(otpCode, await bcrypt.genSalt());

        await this.otpRepo.delete({ email });

        const otp = this.otpRepo.create({
            email,
            code: hashedOtp,
            expires_at: expiresAt,
        });

        await this.otpRepo.save(otp);

        await this.sendEmail(email, otpCode, user.profile.fullname);

        return { __customMessage: "OTP sent to your email." };
    }


    private async sendEmail(email: string, otpCode: string, fullname: string) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"ANT" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject: 'Your OTP Code',
            html: renderRegisterOtpHtml(otpCode, fullname),
        });
    }

    // ============================
    // Verify OTP
    // ============================
    async verifyOtp(email: string, otpCode: string) {
        const otp = await this.otpRepo.findOne({ where: { email } });
        if (!otp) throw new BadRequestException("Invalid OTP request.");
        if (otp.used) throw new BadRequestException("Invalid OTP request.");
        if (otp.expires_at < new Date())
            throw new BadRequestException("OTP expired.");

        const isMatch = await bcrypt.compare(otpCode, otp.code);
        if (!isMatch) throw new BadRequestException("Invalid OTP.");

        // mark OTP as used
        otp.used = true;
        await this.otpRepo.save(otp);

        // get user
        const user = await this.userRepo.findOne({
            where: { email },
            relations: ['profile'],
        });
        if (!user) throw new NotFoundException("User not found.");

        // Only verify email
        user.isVerifyEmail = true;
        await this.userRepo.save(user);

        // DO NOT touch alumni status
        // status stays: PENDING / APPROVED / REJECTED

        return { __customMessage: "Email verified successfully." };
    }

}
