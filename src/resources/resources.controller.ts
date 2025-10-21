import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import type { UUID } from 'crypto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  public async create(@Body() data: any) {
    const { name, companyId, id } = data;

    return await this.resourcesService.create({
      name,
      companyId,
      id,
    });
  }

  @Get('companies/:companyId')
  public async getByCompany(@Param() params: { companyId: UUID }) {
    const { companyId } = params;
    return await this.resourcesService.getByCompany({ companyId });
  }

  @Get(':id')
  public async getById(@Param() params: { id: UUID }) {
    const { id } = params;
    return await this.resourcesService.getById({ id });
  }

  @Put(':id')
  public async update(@Body() data: any) {
    const { id, ...rest } = data;
    return await this.resourcesService.update({ id, data: rest });
  }

  @Delete(':id')
  public async delete(@Param() params: { id: UUID }) {
    const { id } = params;
    return await this.resourcesService.delete({ id });
  }
}
