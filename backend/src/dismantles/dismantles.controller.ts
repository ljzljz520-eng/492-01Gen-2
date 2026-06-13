import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DismantlesService } from './dismantles.service';
import { CreateDismantleDto } from './dto/create-dismantle.dto';
import { UpdateDismantleDto } from './dto/update-dismantle.dto';

@Controller('dismantles')
export class DismantlesController {
  constructor(private readonly dismantlesService: DismantlesService) {}

  @Post()
  create(@Body() createDismantleDto: CreateDismantleDto) {
    return this.dismantlesService.create(createDismantleDto);
  }

  @Get()
  findAll() {
    return this.dismantlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dismantlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDismantleDto: UpdateDismantleDto) {
    return this.dismantlesService.update(+id, updateDismantleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dismantlesService.remove(+id);
  }
}
