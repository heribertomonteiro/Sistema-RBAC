import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async singIn(email: string, pass: string): Promise<{ access_token: string }> {
        const user = await this.userService.findByEmail(email);
        
        if (!user || user.isActive === false) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const storedHash = user.password;
        let isPasswordValid = false;
        let shouldRehashToArgon2 = false;

        if (storedHash?.startsWith('$argon2')) {
            isPasswordValid = await argon2.verify(storedHash, pass);
        } else if (storedHash?.startsWith('$2')) {
            isPasswordValid = await bcrypt.compare(pass, storedHash);
            shouldRehashToArgon2 = isPasswordValid;
        } else {
            try {
                isPasswordValid = await argon2.verify(storedHash, pass);
            } catch {
                isPasswordValid = await bcrypt.compare(pass, storedHash);
                shouldRehashToArgon2 = isPasswordValid;
            }
        }

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (shouldRehashToArgon2) {
            const newHash = await argon2.hash(pass, { type: argon2.argon2id });
            await this.userService.updatePasswordHash(user.id, newHash);
            user.password = newHash;
        }

        const { password, ...result } = user;
        return this.login(result);
    }

    async login(user: any) {
        const payload = { email: user.email, name: user.name, sub: user.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
