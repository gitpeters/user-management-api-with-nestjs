import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}

    async verifyUser(email:string, password:string){
        try {
            const user = await this.userService.getUserByEmail(email);
            const authenticated = await compare(password, user.password);
            if(!authenticated){
                throw new UnauthorizedException();
            }
            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials provided')
        }
    }

    async login(user: User, response: Response) {
      const accessTokenExpirationMs = this.computeTokenExpirationInMs(this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION'));
    
      const tokenPayload: TokenPayload = {
        userEmail: user.email,
      };
    
      const accessToken = this.computeJwtToken(tokenPayload, this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'), accessTokenExpirationMs / 1000);
  
      const expiresAccessToken = new Date(Date.now() + accessTokenExpirationMs);
    
      this.setTokenToCookie(response, accessToken, 'Authentication', expiresAccessToken);
  
      const refreshTokenExpirationMs = this.computeTokenExpirationInMs(this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION'));
  
      const refreshToken = this.computeJwtToken(tokenPayload, this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'), refreshTokenExpirationMs / 1000);
  
      const expiresRefreshToken = new Date(Date.now() + refreshTokenExpirationMs);
      this.setTokenToCookie(response, refreshToken, 'Refresh', expiresRefreshToken);
  
      // Update the user record with the hashed refresh token
      await this.userService.updateUserRecord(user.email, user, await hash(refreshToken, 10));
  
  }
  
  setTokenToCookie(response: Response, jwtToken: string, tokenType: string, expirationTime: Date) {
      response.cookie(tokenType, jwtToken, {
          httpOnly: true,
          secure: this.configService.get('NODE_ENV') === 'production',
          expires: expirationTime,
      });
  }
  
  computeJwtToken(tokenPayload: TokenPayload, secret: string, expirationTime: number): string {
      return this.jwtService.sign(tokenPayload, {
          secret: secret,
          expiresIn: expirationTime, 
      });
  }
  
  computeTokenExpirationInMs(val: string): number {
      return parseInt(val); 
  }
  

  async verifyUserJwtRefreshToken(refreshToken:string, userEmail:string){
    try {
        const user = await this.userService.getUserByEmail(userEmail);
        const authenticated = await compare(refreshToken, user.refreshToken);
        if(!authenticated){
            throw new UnauthorizedException();
        }
        return user; 
    } catch (err) {
      console.error(err)
        throw new UnauthorizedException('Invalid refresh token.')
    }

  }
      
}
