import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dismantle } from '../entities/dismantle.entity';
import { CreateDismantleDto } from './dto/create-dismantle.dto';
import { UpdateDismantleDto } from './dto/update-dismantle.dto';

@Injectable()
export class DismantlesService {
  constructor(
    @InjectRepository(Dismantle)
    private dismantlesRepository: Repository<Dismantle>,
  ) {}

  create(createDismantleDto: CreateDismantleDto) {
    const dismantle = this.dismantlesRepository.create(createDismantleDto as any);
    return this.dismantlesRepository.save(dismantle);
  }

  findAll() {
    return this.dismantlesRepository.find();
  }

  async findOne(id: number) {
    const dismantle = await this.dismantlesRepository.findOne({ where: { id } });
    if (!dismantle) {
      throw new NotFoundException(`Dismantle with ID ${id} not found`);
    }
    return dismantle;
  }

  async update(id: number, updateDismantleDto: UpdateDismantleDto) {
    const dismantle = await this.findOne(id);
    Object.assign(dismantle, updateDismantleDto);
    return this.dismantlesRepository.save(dismantle);
  }

  async remove(id: number) {
    const result = await this.dismantlesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Dismantle with ID ${id} not found`);
    }
  }
}
