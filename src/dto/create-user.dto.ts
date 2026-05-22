import { IsArray, IsEnum, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "../common/enums/user-role.enum";

export class CreateUserDto {

    @ApiProperty({ example: 'Heriberto Monteiro' })
    @IsNotEmpty()
    @MinLength(3)
    name!: string;

    @ApiProperty({ example: 'heriberto@example.com' })
    @IsNotEmpty()
    @MinLength(5)
    email!: string;

    @ApiPropertyOptional({ isArray: true, enum: UserRole, example: [UserRole.Admin] })
    @IsOptional()
    @IsArray()
    @IsEnum(UserRole, { each: true })
    roles?: UserRole[];

    @ApiProperty({ example: 'flamengo762' })
    @IsNotEmpty()
    @MinLength(5)
    password!: string;
}