import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
  ) {}

  create(createScheduleDto: CreateScheduleDto) {
    const schedule = this.schedulesRepository.create(createScheduleDto as any);
    return this.schedulesRepository.save(schedule);
  }

  findAll() {
    return this.schedulesRepository.find();
  }

  async findOne(id: number) {
    const schedule = await this.schedulesRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.findOne(id);
    Object.assign(schedule, updateScheduleDto);
    return this.schedulesRepository.save(schedule);
  }

  async remove(id: number) {
    const result = await this.schedulesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
  }
}
