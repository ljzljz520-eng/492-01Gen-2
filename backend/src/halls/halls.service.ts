import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hall } from '../entities/hall.entity';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';

@Injectable()
export class HallsService {
  constructor(
    @InjectRepository(Hall)
    private hallsRepository: Repository<Hall>,
  ) {}

  create(createHallDto: CreateHallDto) {
    const hall = this.hallsRepository.create(createHallDto);
    return this.hallsRepository.save(hall);
  }

  findAll() {
    return this.hallsRepository.find();
  }

  async findOne(id: number) {
    const hall = await this.hallsRepository.findOne({ where: { id } });
    if (!hall) {
      throw new NotFoundException(`Hall with ID ${id} not found`);
    }
    return hall;
  }

  async update(id: number, updateHallDto: UpdateHallDto) {
    const hall = await this.findOne(id);
    Object.assign(hall, updateHallDto);
    return this.hallsRepository.save(hall);
  }

  async remove(id: number) {
    const result = await this.hallsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Hall with ID ${id} not found`);
    }
  }
}
