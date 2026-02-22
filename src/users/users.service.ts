import { Injectable } from "@nestjs/common";
import type { User } from "@prisma/client";
import { CreateUserDto } from "src/dto/create-user.dto";
import { UserRole } from "src/common/enums/user-role.enum";
import * as bcrypt from 'bcrypt';
import { PrismaService } from "prisma/prisma.service";

@Injectable()

export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(user: CreateUserDto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                roles: user.roles ?? [UserRole.User],
                password: hashedPassword,
            },
        });
    }

    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {email: email},
        });
    }
}