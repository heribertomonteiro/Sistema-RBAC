import { Injectable } from "@nestjs/common";
import { User } from "../interface/users.interface";
import { CreateUserDto } from "src/dto/create-user.dto";
import { UserRole } from "src/common/enums/user-role.enum";

@Injectable()

export class UsersService {
    private readonly users: User[] = [];

    create(user: CreateUserDto) {
        
        const newUser: User = {
            id: this.users.length + 1,
            name: user.name,
            email: user.email,
            roles: user.roles ?? [UserRole.User],
        };

        this.users.push(newUser);
    }

    findAll(): User[] {
        return this.users;
    }
}