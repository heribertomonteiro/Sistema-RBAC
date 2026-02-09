import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "src/dto/create-user.dto";
import { User } from "src/interface/users.interface";

@Controller("users")
export class UsersController {

    constructor(private userService: UsersService) {}

    @Post()
    async create(@Body() CreateUserDto: CreateUserDto) {
        this.userService.create(CreateUserDto);
    }
    
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

}