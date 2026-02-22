import { Injectable } from "@nestjs/common";
import { User } from "../interface/users.interface";
import { CreateUserDto } from "src/dto/create-user.dto";
import { UserRole } from "src/common/enums/user-role.enum";
import * as bcrypt from 'bcrypt';

@Injectable()

export class UsersService {
    private readonly users: User[] = [];

    async create(user: CreateUserDto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const newUser: User = {
            id: this.users.length + 1,
            name: user.name,
            email: user.email,
            roles: user.roles ?? [UserRole.User],
            password: hashedPassword,
        };

        this.users.push(newUser);
    }

    findAll(): User[] {
        return this.users;
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return await this.users.find(user => user.email === email);
    }
}