import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
// import { UserService } from 'src/users/users.service';
import { TokenService } from 'src/tokens/tokens.service';
import { StatusEnum } from 'src/users/constants/status.enum';
import { UserService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY') || 'Secret',
      passReqToCallback: true,
    });
  }

  // async validate(req: Request, payload: any): Promise<User> {
  async validate(req: Request, payload: any){
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided.');
    }
    const existingToken = await this.tokenService.findToken(token);
    if (!existingToken) {
      throw new UnauthorizedException('Token is invalid or has been logged out.');
    }
    const user: User = await this.userService.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    if(!user.isVerifyEmail) throw new UnauthorizedException("User with this email haven't verify yet.")
    if(user.profile.status == StatusEnum.REJECT) throw new UnauthorizedException("This account found suspicious, and got reject by admin.")
    return user;
  }
}
