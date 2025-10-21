import { BadRequestException, Injectable } from '@nestjs/common';
import type { UUID } from 'crypto';
import { CompaniesService } from 'src/companies/companies.service';
import type { Replace } from 'src/helpers/replace.helper';

export interface Resource {
  id: UUID;
  name: string;
  companyId: UUID;
  isActive: boolean;
}

const resources: Resource[] = [
  {
    name: 'Serviço de exemplo',
    companyId: '4ca3058e-9064-46ef-b93f-b7451e555e02',
    id: '2aa2b2e7-7317-4ec5-9922-502b7356bb8b',
    isActive: true,
  },
];

@Injectable()
export class ResourcesService {
  constructor(private readonly companiesService: CompaniesService) {}

  public async create(
    dto: Replace<Resource, { id?: UUID; isActive?: boolean }>,
  ): Promise<Resource> {
    const existingResource = resources.find((e) => e.id === dto.id);
    if (existingResource)
      throw new BadRequestException('This resource already exists');

    await this.companiesService.getById({ id: dto.companyId });

    const newResource: Resource = {
      ...dto,
      id: dto.id ?? crypto.randomUUID(),
      isActive: dto.isActive ?? true,
    };

    resources.push(newResource);

    return { ...newResource };
  }

  public async getByCompany(dto: { companyId: UUID }): Promise<Resource[]> {
    const companyResources = resources.filter(
      (r) => r.companyId === dto.companyId,
    );

    return companyResources;
  }

  public async getById(dto: { id: UUID }): Promise<Resource> {
    const resource = resources.find((f) => f.id === dto.id);
    if (!resource) throw new BadRequestException("This resource wasn't found");

    return resource;
  }

  public async update(dto: {
    data: Replace<Resource, { name?: string; isActive?: boolean }>;
    id: UUID;
  }): Promise<Resource> {
    const resourceIndex = resources.findIndex((f) => f.id === dto.id);
    const resource = resources[resourceIndex];
    if (!resource) throw new BadRequestException("This resource wasn't found");

    const newResource: Resource = { ...resource, ...dto.data };
    resources[resourceIndex] = newResource;

    return newResource;
  }

  public async delete(dto: { id: UUID }): Promise<Resource> {
    const resourceIndex = resources.findIndex((f) => f.id === dto.id);
    const resource = resources[resourceIndex];
    if (!resource) throw new BadRequestException("This resource wasn't found");

    const newResource: Resource = { ...resource, isActive: false };
    resources[resourceIndex] = newResource;

    return resource;
  }
}
