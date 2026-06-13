import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DamagePhoto } from '../entities/damage-photo.entity';
import { CreateDamagePhotoDto } from './dto/create-damage-photo.dto';
import { UpdateDamagePhotoDto } from './dto/update-damage-photo.dto';

@Injectable()
export class DamagePhotosService {
  constructor(
    @InjectRepository(DamagePhoto)
    private damagePhotosRepository: Repository<DamagePhoto>,
  ) {}

  create(createDamagePhotoDto: CreateDamagePhotoDto) {
    const damagePhoto = this.damagePhotosRepository.create(createDamagePhotoDto);
    return this.damagePhotosRepository.save(damagePhoto);
  }

  findAll() {
    return this.damagePhotosRepository.find();
  }

  async findOne(id: number) {
    const damagePhoto = await this.damagePhotosRepository.findOne({ where: { id } });
    if (!damagePhoto) {
      throw new NotFoundException(`DamagePhoto with ID ${id} not found`);
    }
    return damagePhoto;
  }

  async update(id: number, updateDamagePhotoDto: UpdateDamagePhotoDto) {
    const damagePhoto = await this.findOne(id);
    Object.assign(damagePhoto, updateDamagePhotoDto);
    return this.damagePhotosRepository.save(damagePhoto);
  }

  async remove(id: number) {
    const result = await this.damagePhotosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`DamagePhoto with ID ${id} not found`);
    }
  }
}
