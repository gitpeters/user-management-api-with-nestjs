import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Request } from "express";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy,'jwt-refresh'){
    constructor(configService: ConfigService, private readonly authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.Refresh
            ]),
            secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true
        });
    }

    async validate(request: Request, tokenPayload: TokenPayload){
        return this.authService.verifyUserJwtRefreshToken(request.cookies?.Refresh, tokenPayload.userEmail);
    }
}