import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async singIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (user.password !== pass) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const { password, ...result } = user;
        return null;        
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
