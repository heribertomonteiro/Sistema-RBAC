import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async singIn(email: string, pass: string): Promise<{ access_token: string }> {
        const user = await this.userService.findByEmail(email);
        
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }
        
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const { password, ...result } = user;
        return this.login(result);
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
