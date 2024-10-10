import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { hash } from 'bcryptjs';
import { emit } from 'process';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService){}

  async create(createUserDto: CreateUserDto) {
    return this.databaseService.user.create({
      data: {...createUserDto,
        password: await hash(createUserDto.password, 10),
      }
    })
  }

 async findAll() {
    return this.databaseService.user.findMany({
      select:{
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        isActive: true,
  
      }
    })
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: { id },
      select:{
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        isActive: true,
        addresses: true,
  
      },
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.databaseService.user.update({
      where: {id},
      data: updateUserDto
    })
  }

  async remove(id: number) {
    return this.databaseService.user.delete({
      where: { id }
    })
  }

  async getUserByEmail(email: string){
    return this.databaseService.user.findUnique({
      where: {email}
    })
  }

  async updateUserRecord(email:string, user:User, refreshToken:string){
    return this.databaseService.user.update({
      where: {email: email},
      data: {...user, refreshToken: refreshToken}
    })
  }
}


