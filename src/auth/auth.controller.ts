import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, loginDto, RegisterDto, UpdateUserDto } from './dto';
import { GuardGuard } from './guard/guard.guard';
import { request } from 'http';
import { User } from './entities/user.entity';
import { register } from './interface/register-interface';




@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    

    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: loginDto ){
      return this.authService.login(loginUserDto)
  }

  @Post('/register')
  register(@Body() registerDto: RegisterDto ){
    return this.authService.register(registerDto)
  }

  
  @UseGuards(GuardGuard)
  @Get()
  findAll(@Request() req: Request) {

    /* const user = req['user'];

    return user */
    /* console.log(req); */
    return this.authService.findAll();
  }

  @UseGuards(GuardGuard)
  @Get('check-token') 
  newJwt(@Request() req: Request): register{
    const users = req['user'] as User;
    return {
      users,
      token: this.authService.getJwtoken({id: users._id})
    }
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  } */
}
