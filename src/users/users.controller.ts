import { Body, Controller, Get, Post, Query, UseGuards, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "src/dto/create-user.dto";
import type { User } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PrismaService } from "prisma/prisma.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/enums/user-role.enum";
import { RolesGuard } from "src/auth/roles.guard";

@Controller("users")
export class UsersController {
    prisma: any;

    constructor(private userService: UsersService, private prismaService: PrismaService) {
        this.prisma = this.prismaService;
    }

    @Post()
    async create(@Body() CreateUserDto: CreateUserDto) {
       return this.userService.create(CreateUserDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Get()
    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                roles: true,
            }
        });
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Get("search")
    async findByEmail(@Query("email") email: string): Promise<User | null> {
        return this.userService.findByEmail(email);
    }



}