import { BadRequestException, Injectable } from '@nestjs/common';
import type { UUID } from 'crypto';
import type { Replace } from 'src/helpers/replace.helper';

export interface Company {
  id: UUID;
  name: string;
  registry: string;
  isActive: boolean;
}

const companies: Company[] = [
  {
    name: 'Empresa',
    registry: '12345678901',
    id: '4ca3058e-9064-46ef-b93f-b7451e555e02',
    isActive: true,
  },
];

@Injectable()
export class CompaniesService {
  public async create(
    dto: Replace<Company, { id?: UUID; isActive?: boolean }>,
  ): Promise<Company> {
    const existingCompany = companies.find(
      (e) => e.id === dto.id || e.registry === dto.registry,
    );
    if (existingCompany)
      throw new BadRequestException('This company already exists');

    const newCompany: Company = {
      ...dto,
      id: dto.id ?? crypto.randomUUID(),
      isActive: dto.isActive ?? true,
    };

    companies.push(newCompany);

    return { ...newCompany };
  }

  public async getAll(): Promise<Company[]> {
    return companies;
  }

  public async getById(dto: { id: UUID }): Promise<Company> {
    const company = companies.find((f) => f.id === dto.id);
    if (!company) throw new BadRequestException("This company wasn't found");

    return company;
  }

  public async update(dto: {
    data: Replace<
      Company,
      { name?: string; registry?: string; isActive?: boolean }
    >;
    id: UUID;
  }): Promise<Company> {
    const companyIndex = companies.findIndex((f) => f.id === dto.id);
    const company = companies[companyIndex];
    if (!company) throw new BadRequestException("This company wasn't found");

    const isConflicting = companies.some(
      (e) => e.registry === company.registry,
    );
    if (isConflicting)
      throw new BadRequestException('This company already exists');

    const newCompany: Company = { ...company, ...dto.data };
    companies[companyIndex] = newCompany;

    return newCompany;
  }

  public async delete(dto: { id: UUID }): Promise<Company> {
    const companyIndex = companies.findIndex((f) => f.id === dto.id);
    const company = companies[companyIndex];
    if (!company) throw new BadRequestException("This company wasn't found");

    const newCompany: Company = { ...company, isActive: false };
    companies[companyIndex] = newCompany;

    return company;
  }
}
