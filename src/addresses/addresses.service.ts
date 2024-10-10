import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AddressesService {

  constructor(private readonly databaseService: DatabaseService){}

  async create(createAddressDto: CreateAddressDto) {
    return this.databaseService.address.create({
      data: createAddressDto
    })
  }

  async findAll(userId:number) {
    return this.databaseService.address.findMany({
      where: {userId: userId}
    })
  }

  async findOne(id: number) {
    return this.databaseService.address.findUnique({
      where: { id }
    })
  }

  async update(id: number, updateAddressDto: Prisma.AddressUpdateInput) {
    return this.databaseService.address.update({
      where: {id},
      data: updateAddressDto
    })
  }

  async remove(id: number) {
    return this.databaseService.address.delete({
      where: {id}
    })
  }
}
