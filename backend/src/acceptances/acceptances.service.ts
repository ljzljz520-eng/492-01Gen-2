import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Acceptance } from '../entities/acceptance.entity';
import { CreateAcceptanceDto } from './dto/create-acceptance.dto';
import { UpdateAcceptanceDto } from './dto/update-acceptance.dto';

@Injectable()
export class AcceptancesService {
  constructor(
    @InjectRepository(Acceptance)
    private acceptancesRepository: Repository<Acceptance>,
  ) {}

  create(createAcceptanceDto: CreateAcceptanceDto) {
    const acceptance = this.acceptancesRepository.create(createAcceptanceDto as any);
    return this.acceptancesRepository.save(acceptance);
  }

  findAll(projectId?: number) {
    const where: any = {};
    if (projectId) {
      where.projectId = projectId;
    }
    return this.acceptancesRepository.find({ where });
  }

  findByProject(projectId: number) {
    return this.acceptancesRepository.find({ where: { projectId } });
  }

  async findOne(id: number) {
    const acceptance = await this.acceptancesRepository.findOne({ where: { id } });
    if (!acceptance) {
      throw new NotFoundException(`Acceptance with ID ${id} not found`);
    }
    return acceptance;
  }

  async update(id: number, updateAcceptanceDto: UpdateAcceptanceDto) {
    const acceptance = await this.findOne(id);
    Object.assign(acceptance, updateAcceptanceDto);
    return this.acceptancesRepository.save(acceptance);
  }

  async remove(id: number) {
    const result = await this.acceptancesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Acceptance with ID ${id} not found`);
    }
  }
}
