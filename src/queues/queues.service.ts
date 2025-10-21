import { BadRequestException, Injectable } from '@nestjs/common';
import type { UUID } from 'crypto';
import type { Replace } from 'src/helpers/replace.helper';
import * as crypto from 'crypto';

export interface User {
  id: UUID;
  name: string;
  resourceId: UUID;
  scheduledTime: Date;
  queueId: UUID;
  isActive: boolean;
}

export interface Queue {
  id: UUID;
  name: string;
  companyId: UUID;
  isActive: boolean;
  users: User[];
  currentUserIndex: number | null;
}

const queues: Queue[] = [
  {
    name: 'Exemplo de serviço',
    companyId: '4ca3058e-9064-46ef-b93f-b7451e555e02',
    id: 'fd60a4b4-c40d-4c52-9e10-2f7bedbe134d',
    isActive: true,
    users: [
      {
        name: 'John Doe',
        resourceId: '2aa2b2e7-7317-4ec5-9922-502b7356bb8b',
        scheduledTime: new Date('21/10/2025, 10:30:00'),
        queueId: 'fd60a4b4-c40d-4c52-9e10-2f7bedbe134d',
        id: '44bb0fdf-c95c-4c16-a966-df7d9802a416',
        isActive: true,
      },
      {
        name: 'Mary Jane',
        resourceId: '2aa2b2e7-7317-4ec5-9922-502b7356bb8b',
        scheduledTime: new Date('21/10/2025, 11:00:00'),
        queueId: 'fd60a4b4-c40d-4c52-9e10-2f7bedbe134d',
        id: '6de33e6f-99c9-482f-aa1f-48669f68dab8',
        isActive: true,
      },
    ],
    currentUserIndex: null,
  },
];

@Injectable()
export class QueuesService {
  public async create(
    dto: Replace<
      Queue,
      {
        id?: UUID;
        isActive?: boolean;
        users?: User[];
        currentUserIndex?: number | null;
      }
    >,
  ) {
    if (!dto.companyId) throw new BadRequestException('companyId is required');

    const existingQueue = queues.find(
      (e) => e.name === dto.name && e.companyId === dto.companyId,
    );
    if (existingQueue)
      throw new BadRequestException(
        'This queue already exists for this company',
      );

    const newQueue: Queue = {
      ...dto,
      id: (dto.id as UUID) ?? (crypto.randomUUID() as UUID),
      isActive: dto.isActive ?? true,
      users: [],
      currentUserIndex: null,
    };

    queues.push(newQueue);
    return { ...newQueue };
  }

  public async add(dto: Replace<User, { id?: UUID; isActive?: boolean }>) {
    const queue = queues.find((e) => e.id === dto.queueId);
    if (!queue) throw new BadRequestException("This queue doesn't exist");

    const newUser: User = {
      ...dto,
      id: (dto.id as UUID) ?? (crypto.randomUUID() as UUID),
      isActive: dto.isActive ?? true,
    };

    queue.users.push(newUser);
    return { ...newUser };
  }

  public async current(queueId: UUID) {
    const queue = queues.find((e) => e.id === queueId);
    if (!queue) throw new BadRequestException('Queue not found');

    if (queue.currentUserIndex === null)
      return { message: 'Queue has not started yet' };

    return queue.users[queue.currentUserIndex] ?? null;
  }

  public async next(queueId: UUID) {
    const queue = queues.find((e) => e.id === queueId);
    if (!queue) throw new BadRequestException('Queue not found');

    if (queue.users.length === 0)
      throw new BadRequestException('Queue has no users');

    if (queue.currentUserIndex === null) {
      queue.currentUserIndex = 0;
    } else if (queue.currentUserIndex < queue.users.length - 1) {
      queue.currentUserIndex++;
    } else {
      queue.currentUserIndex = null;
      return { message: 'Queue finished' };
    }

    return queue.users[queue.currentUserIndex];
  }

  public async previous(queueId: UUID) {
    const queue = queues.find((e) => e.id === queueId);
    if (!queue) throw new BadRequestException('Queue not found');

    if (queue.currentUserIndex === null || queue.currentUserIndex <= 0)
      throw new BadRequestException('No previous user');

    queue.currentUserIndex--;
    return queue.users[queue.currentUserIndex];
  }

  public async findAll() {
    return queues;
  }

  public async findByCompany(companyId: UUID) {
    return queues.filter((e) => e.companyId === companyId);
  }

  public async findById(id: UUID) {
    const queue = queues.find((e) => e.id === id);
    if (!queue) throw new BadRequestException('Queue not found');
    return queue;
  }
}
