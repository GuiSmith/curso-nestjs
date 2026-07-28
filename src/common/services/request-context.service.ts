import { ForbiddenException, Inject, Injectable, Request, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { User } from "@prisma/client";

type AuthenticatedRequest = Request & { user?: User }

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {

    constructor(@Inject(REQUEST) private readonly request: AuthenticatedRequest) {}

    getUser(): User {

        const user = this.request.user;

        if(!user){
            throw new ForbiddenException();
        }

        return user;
    }

    isUserAdmin(): boolean {
        const user = this.getUser();

        return user.role === 'ADMIN';
    }
}
