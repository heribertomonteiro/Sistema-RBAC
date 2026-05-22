import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { RolesGuard } from "../auth/roles.guard";
import { UpdateUserRolesDto } from "../dto/update-user-roles.dto";

@ApiTags("users")
@ApiBearerAuth('jwt')
@Controller("users")
export class UsersController {
    constructor(private userService: UsersService) {}

    @ApiOperation({ summary: "(Admin) Create a user" })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Post()
    async create(@Body() dto: CreateUserDto) {
       return this.userService.create(dto);
    }

    @ApiOperation({ summary: "(Admin) List all users" })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Get()
    async findAll() {
        return this.userService.findAllSafe();
    }
    
    @ApiOperation({ summary: "Get current user profile (JWT)" })
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @ApiOperation({ summary: "(Admin) Find user by email" })
    @ApiQuery({ name: 'email', required: true, type: String })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Get("search")
    async findByEmail(@Query("email") email: string) {
        return this.userService.findByEmailSafe(email);
    }

    @ApiOperation({ summary: "(Admin) Update user roles" })
    @ApiParam({ name: 'id', type: Number })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Patch(":id/roles")
    async updateRoles(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateUserRolesDto,
    ) {
        return this.userService.updateRoles(id, dto.roles);
    }

    @ApiOperation({ summary: "(Admin) Delete user" })
    @ApiParam({ name: 'id', type: Number })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Patch(":id")
    async remove(@Param("id", ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }



}