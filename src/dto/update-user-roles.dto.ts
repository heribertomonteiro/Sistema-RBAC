import { IsArray, IsEnum, ArrayNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../common/enums/user-role.enum";

export class UpdateUserRolesDto {
    @ApiProperty({ isArray: true, enum: UserRole, example: [UserRole.Moderator] })
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(UserRole, { each: true })
    roles!: UserRole[];
}
