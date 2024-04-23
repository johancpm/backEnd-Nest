import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs'

import { CreateUserDto, loginDto, RegisterDto, UpdateUserDto } from './dto';



import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtToken } from './interface/jwt-interface';
import { register } from './interface/register-interface';





@Injectable()
export class AuthService {

 constructor(
  @InjectModel(User.name) 
  private catModel: Model<User>,
  private jwtService: JwtService
 ){}

 async create(createAuthDto: CreateUserDto): Promise<User> {
    
   try {

    const {password, ...datosUsuario} = createAuthDto
     const userSave = new this.catModel({
      password: bcryptjs.hashSync(password, 10),
      ...datosUsuario,
     })
     
     /* #1 Encriptar Contraseña */
 
     /* #2 Guardar usuario en la base de datos  */
       
     /* #3 Generar el JWT  */



       await userSave.save()

       const {password:_, ...dateUser} = userSave.toJSON();

       return dateUser
      
    } catch (error) {
      if(error.code === 11000){
        throw new BadRequestException(`${createAuthDto.email} already exists `)
      }
      throw new InternalServerErrorException('something terrible happen!!!')
    }
  }

 async register(dateUser: RegisterDto):Promise<register>{

   
    await this.create(dateUser)
   
   
     return await this.login(dateUser)
      
    



  }

  async login(loginUser: loginDto):Promise<register>{
    const {password, email} = loginUser

    const User = await this.catModel.findOne({email});

    if(!User){
       throw new UnauthorizedException('Not Valid Credential - Email')
    }

    if(!bcryptjs.compareSync(password, User.password)){
      throw new UnauthorizedException('Not Valid Credential - Password')
    }

    const {password:_, ...dateUser} = User.toJSON()

    return {
      users: dateUser,
      token: this.getJwtoken({ id: User.id})
    }
  }

  findAll(): Promise<User[]> {
    return this.catModel.find();

    



    
  }



 async findUserById(id: string) {
     const user = await this.catModel.findById(id)
     const {password:_ , ...rest} = user.toJSON()

     return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtoken(payload: jwtToken){
    const token = this.jwtService.sign(payload);

    return token;
    
  }
}
