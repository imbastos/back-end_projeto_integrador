import { BadRequestException, Injectable } from '@nestjs/common';
import type { UUID } from 'crypto';
import type { Replace } from 'src/helpers/replace.helper';
import * as crypto from 'crypto';

export interface User {
  id: number;
  name: string;
  resourceId: UUID;
  scheduledTime: Date;
  queueId: UUID;
  status?: 'skipped' | 'attended' | 'canceled';
  tier?: 'priority';
  updatedAt: Date;
  createdAt: Date;
}

export interface Queue {
  id: UUID;
  name: string;
  companyId: UUID;
  users: User[];
  currentUserIndex: number | null;
  isActive: boolean;
  updatedAt: Date;
  createdAt: Date;
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
        resourceId: '2aa2b2e7-7317-4ec5-9922-502b7356bb8a',
        scheduledTime: new Date('21/10/2025, 10:30:00'),
        queueId: 'fd60a4b4-c40d-4c52-9e10-2f7bedbe134d',
        id: 1,
        tier: 'priority',
        createdAt: new Date('13/10/2025, 11:00:00'),
        updatedAt: new Date('13/10/2025, 11:00:00'),
      },
      {
        name: 'Lara Croft',
        resourceId: '2aa2b2e7-7317-4ec5-9922-502b7356bb8b',
        scheduledTime: new Date('21/10/2025, 10:45:00'),
        queueId: 'fd60a4b4-c40d-4c52-9e10-2f7bedbe134d',
        id: 2,
        createdAt: new Date('21/10/2025, 08:00:00'),
        updatedAt: new Date('21/10/2025, 09:40:00'),
      },
      {
        name: 'Mike Wazowski',
        resourceId: '2aa2b2e7-7317-4ec5-9922-502b7356bb8b',
        scheduledTime: new Date('21/10/2025, 11:00:00'),
        queueId: 'fd60a4b4-c40d-4c52-9e10-2f7bedbe134d',
        id: 3,
        tier: 'priority',
        createdAt: new Date('20/10/2025, 13:00:00'),
        updatedAt: new Date('20/10/2025, 13:00:00'),
      },
      {
        name: 'Mary Jane',
        resourceId: '2aa2b2e7-7317-4ec5-9922-502b7356bb8a',
        scheduledTime: new Date('21/10/2025, 11:15:00'),
        queueId: 'fd60a4b4-c40d-4c52-9e10-2f7bedbe134d',
        id: 4,
        status: 'canceled',
        tier: 'priority',
        createdAt: new Date('20/10/2025, 08:00:00'),
        updatedAt: new Date('21/10/2025, 10:00:00'),
      },
    ],
    createdAt: new Date('21/10/2025, 08:00:00'),
    updatedAt: new Date('21/10/2025, 09:00:00'),
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
        updatedAt?: Date;
        createdAt?: Date;
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    queues.push(newQueue);
    return { ...newQueue };
  }

  public async add(
    dto: Replace<
      User,
      { id?: number; isActive?: boolean; updatedAt?: Date; createdAt?: Date }
    >,
  ) {
    const queue = queues.find((e) => e.id === dto.queueId);
    if (!queue) throw new BadRequestException("This queue doesn't exist");

    const newUser: User = {
      ...dto,
      id: (dto.id as number) ?? queue.users.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      queue.currentUserIndex++;
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
