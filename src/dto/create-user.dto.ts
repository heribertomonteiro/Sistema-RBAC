import { UserRole } from "src/common/enums/user-role.enum";

export class CreateUserDto {
    name: string;
    email: string;
    roles?: UserRole[];
    password: string;
}