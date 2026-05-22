import { Injectable, BadRequestException } from "@nestjs/common";
import type { User } from "@prisma/client";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserRole } from "../common/enums/user-role.enum";
import * as argon2 from 'argon2';
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()

export class UsersService {
    constructor(private prisma: PrismaService) {}

    private readonly safeUserSelect = {
        id: true,
        name: true,
        email: true,
        roles: true,
        isActive: true,
    } as const;

    async create(user: CreateUserDto) {
        if (!user.password) {
            throw new BadRequestException('Password is required');
        }

        const hashedPassword = await argon2.hash(user.password, { type: argon2.argon2id });
        return this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                roles: user.roles ?? [UserRole.User],
                password: hashedPassword,
            },
            select: this.safeUserSelect,
        });
    }

    async updatePasswordHash(userId: number, passwordHash: string): Promise<User> {
        return this.prisma.user.update({
            where: { id: userId },
            data: { password: passwordHash },
        });
    }

    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    async findAllSafe() {
        return this.prisma.user.findMany({
            select: this.safeUserSelect,
        });
    }

    async findByEmailSafe(email: string) {
        if (!email) {
            return null;
        }

        return this.prisma.user.findUnique({
            where: { email },
            select: this.safeUserSelect,
        });
    }

    async updateRoles(userId: number, roles: UserRole[]) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { roles },
            select: this.safeUserSelect,
        });
    }

    async deleteUser(userId: number) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isActive: false },
            select: this.safeUserSelect,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        
        if (!email) {
            return null;
        }
        
        return await this.prisma.user.findUnique({
            where: {email: email},
        });
    }
}