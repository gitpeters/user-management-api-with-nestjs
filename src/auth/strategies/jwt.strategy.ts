import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(configService: ConfigService, private readonly userService: UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.Authentication
            ]),
            secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET')
        });
    }

    async validate(payload:TokenPayload){
        return this.userService.getUserByEmail(payload.userEmail);
    }

}