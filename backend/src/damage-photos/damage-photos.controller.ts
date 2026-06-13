import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DamagePhotosService } from './damage-photos.service';
import { CreateDamagePhotoDto } from './dto/create-damage-photo.dto';
import { UpdateDamagePhotoDto } from './dto/update-damage-photo.dto';

@Controller('damage-photos')
export class DamagePhotosController {
  constructor(private readonly damagePhotosService: DamagePhotosService) {}

  @Post()
  create(@Body() createDamagePhotoDto: CreateDamagePhotoDto) {
    return this.damagePhotosService.create(createDamagePhotoDto);
  }

  @Get()
  findAll() {
    return this.damagePhotosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.damagePhotosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDamagePhotoDto: UpdateDamagePhotoDto) {
    return this.damagePhotosService.update(+id, updateDamagePhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.damagePhotosService.remove(+id);
  }
}
