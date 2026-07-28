import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { toSafeUser } from "src/common/mappers/toSafeUser.mapper";
import { PrismaService } from "src/prisma.service";
import { AuthenticatedUserDTO } from "../users/users.dto";
import { PURPOSE_REQUESTS_KEY } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prisma: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY,
        })
    }

    async validate(payload: { sub: string, purpose: string }): Promise<AuthenticatedUserDTO> {

        if(payload.purpose !== PURPOSE_REQUESTS_KEY){
            throw new UnauthorizedException();
        }

        const user = await this.prisma.user.findUnique({ where: { id: payload.sub }});

        if (!user){
            throw new UnauthorizedException();
        }

        return toSafeUser(user);
    }
}
