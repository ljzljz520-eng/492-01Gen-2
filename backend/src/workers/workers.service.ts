import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from '../entities/worker.entity';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(Worker)
    private workersRepository: Repository<Worker>,
  ) {}

  create(createWorkerDto: CreateWorkerDto) {
    const worker = this.workersRepository.create(createWorkerDto as any);
    return this.workersRepository.save(worker);
  }

  findAll(type?: string) {
    const where: any = {};
    if (type) {
      where.type = type;
    }
    return this.workersRepository.find({ where });
  }

  findAvailable(type?: string, needNightPermit?: boolean) {
    const where: any = { isAvailable: true };
    if (type) {
      where.type = type;
    }
    if (needNightPermit) {
      where.hasNightWorkPermit = true;
    }
    return this.workersRepository.find({ where });
  }

  async findOne(id: number) {
    const worker = await this.workersRepository.findOne({ where: { id } });
    if (!worker) {
      throw new NotFoundException(`Worker with ID ${id} not found`);
    }
    return worker;
  }

  async update(id: number, updateWorkerDto: UpdateWorkerDto) {
    const worker = await this.findOne(id);
    Object.assign(worker, updateWorkerDto);
    return this.workersRepository.save(worker);
  }

  async remove(id: number) {
    const result = await this.workersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Worker with ID ${id} not found`);
    }
  }
}
