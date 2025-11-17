import { BadRequestException, Injectable } from '@nestjs/common';
import type { UUID } from 'crypto';

export class User {
  id: UUID;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 'c0da97d1-d0f3-4370-b402-f7e1bbfd355e',
      username: 'admin',
      password: 'admin',
    },
  ];

  public async getById(dto: { id: UUID }): Promise<User> {
    const user = this.users.find((u) => u.id === dto.id);
    if (!user) throw new BadRequestException("This user wasn't found");

    return user;
  }

  public async getByUsername(dto: { username: string }): Promise<User> {
    const user = this.users.find((u) => u.username === dto.username);
    if (!user) throw new BadRequestException("This user wasn't found");

    return user;
  }
}
