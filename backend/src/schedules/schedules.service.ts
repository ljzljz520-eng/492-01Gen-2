import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { Worker } from '../entities/worker.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
    @InjectRepository(Worker)
    private workersRepository: Repository<Worker>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const worker = await this.workersRepository.findOne({
      where: { id: createScheduleDto.workerId },
    });
    if (!worker) {
      throw new NotFoundException('人员不存在');
    }

    if (!worker.isAvailable) {
      throw new BadRequestException('该人员当前不可用');
    }

    if (!worker.hasCertificate) {
      throw new BadRequestException('该人员无从业资格证书，无法安排上岗');
    }

    const isNightShift = createScheduleDto.shift === 'night' || createScheduleDto.nightWork;
    if (isNightShift && !worker.hasNightWorkPermit) {
      throw new BadRequestException('该人员无夜间施工许可，无法安排夜班');
    }

    const schedule = this.schedulesRepository.create({
      ...createScheduleDto,
      nightWork: isNightShift,
    } as any);
    return this.schedulesRepository.save(schedule);
  }

  findAll(projectId?: number) {
    const where: any = {};
    if (projectId) {
      where.projectId = projectId;
    }
    return this.schedulesRepository.find({ where });
  }

  findByProject(projectId: number) {
    return this.schedulesRepository.find({ where: { projectId } });
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
