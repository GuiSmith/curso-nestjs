import { User } from "@prisma/client";
import { AuthenticatedUserDTO } from "src/modules/users/users.dto";

export function toSafeUser(user: User): AuthenticatedUserDTO {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    };
}