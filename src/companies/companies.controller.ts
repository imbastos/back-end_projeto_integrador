import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import type { UUID } from 'crypto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  public async create(@Body() data: any) {
    const { name, registry, id } = data;

    return await this.companiesService.create({
      name,
      registry,
      id
    });
  }

  @Get()
  public async getAll() {
    return await this.companiesService.getAll();
  }

  @Get(':id')
  public async getById(@Param() params: { id: UUID }) {
    const { id } = params;
    return await this.companiesService.getById({ id });
  }

  @Put(':id')
  public async update(@Body() data: any) {
    const { id, ...rest } = data;
    return await this.companiesService.update({ id, data: rest });
  }

  @Delete(':id')
  public async delete(@Param() params: { id: UUID }) {
    const { id } = params;
    return await this.companiesService.delete({ id });
  }
}
