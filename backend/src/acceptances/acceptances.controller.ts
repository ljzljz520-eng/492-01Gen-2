import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AcceptancesService } from './acceptances.service';
import { CreateAcceptanceDto } from './dto/create-acceptance.dto';
import { UpdateAcceptanceDto } from './dto/update-acceptance.dto';

@Controller('acceptances')
export class AcceptancesController {
  constructor(private readonly acceptancesService: AcceptancesService) {}

  @Post()
  create(@Body() createAcceptanceDto: CreateAcceptanceDto) {
    return this.acceptancesService.create(createAcceptanceDto);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.acceptancesService.findByProject(+projectId);
  }

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.acceptancesService.findAll(projectId ? +projectId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acceptancesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAcceptanceDto: UpdateAcceptanceDto) {
    return this.acceptancesService.update(+id, updateAcceptanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acceptancesService.remove(+id);
  }
}
