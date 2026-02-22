import { Body, Controller, Get, Post, Query, UseGuards, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "src/dto/create-user.dto";
import { User } from "src/interface/users.interface";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("users")
export class UsersController {

    constructor(private userService: UsersService) {}

    @Post()
    async create(@Body() CreateUserDto: CreateUserDto) {
        this.userService.create(CreateUserDto);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Get("search")
    async findByEmail(@Query("email") email: string): Promise<User | undefined> {
        return this.userService.findByEmail(email);
    }



}