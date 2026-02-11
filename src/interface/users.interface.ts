import { UserRole } from "src/common/enums/user-role.enum";

export interface User {
    id: number;
    name: string;
    email: string;
    roles?: UserRole[];
    password: string;
}