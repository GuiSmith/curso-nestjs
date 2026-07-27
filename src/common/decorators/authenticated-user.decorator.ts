import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthenticatedUserDTO } from "src/modules/users/users.dto";

export const AuthenticatedUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthenticatedUserDTO => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if(!user){
        throw new UnauthorizedException();
    }

    return user;
})
