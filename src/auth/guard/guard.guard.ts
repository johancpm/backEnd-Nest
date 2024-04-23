import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtToken } from '../interface/jwt-interface';
import { AuthService } from '../auth.service';

@Injectable()
export class GuardGuard implements CanActivate {

constructor(
  private jwtService: JwtService,
  private authservice: AuthService,
){}

 async canActivate(context: ExecutionContext):   Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if(!token){
      throw new UnauthorizedException('no hay token en la peticion ')
    }

    try {
      const payload = await this.jwtService.verifyAsync<jwtToken>(
        token,{secret: process.env.KEY_JWT}
      );
        
      const user = await this.authservice.findUserById(payload.id)
      if(!user){
        throw new UnauthorizedException('User does not exists')
      }
      if(! user.isActive){
        throw new UnauthorizedException('User is not Active')
      }

      /* console.log({payload}) */
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = user;
      
    } catch (error) {
      throw new UnauthorizedException();
    }
    

    return true ;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
