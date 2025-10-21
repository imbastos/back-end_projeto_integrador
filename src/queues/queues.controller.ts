import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { QueuesService, type Queue, type User } from './queues.service';
import type { UUID } from 'crypto';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Post()
  async create(@Body() dto: any) {
    return await this.queuesService.create(dto);
  }

  @Post(':id/users')
  async addUser(@Param('id') id: UUID, @Body() dto: any) {
    return await this.queuesService.add({ ...dto, queueId: id });
  }

  @Get()
  async findAll() {
    return await this.queuesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: UUID) {
    return await this.queuesService.findById(id);
  }

  @Get(':id/current')
  async current(@Param('id') id: UUID) {
    return await this.queuesService.current(id);
  }

  @Patch(':id/next')
  async next(@Param('id') id: UUID) {
    return await this.queuesService.next(id);
  }

  @Patch(':id/previous')
  async previous(@Param('id') id: UUID) {
    return await this.queuesService.previous(id);
  }

  @Patch(':id/reset')
  async reset(@Param('id') id: UUID) {
    const queue = await this.queuesService.findById(id);
    if (!queue) return { message: 'Queue not found' };

    queue.currentUserIndex = null;
    return { message: 'Queue reset successfully', queue };
  }
}
