import { Injectable, NotFoundException } from '@nestjs/common';
          import { InjectRepository } from '@nestjs/typeorm';
          import { Repository } from 'typeorm';
          import { Application } from './application.entity';
          import { CreateApplicationDto, UpdateApplicationDto } from './application.dto';

          @Injectable()
          export class ApplicationService {
            constructor(@InjectRepository(Application) private readonly repo: Repository<Application>) {}

            findAll() {
              return this.repo.find({ relations: ['user', 'permittype'], order: { id: 'DESC' } });
            }

            async findOne(id: number) {
              const item = await this.repo.findOne({ where: { id }, relations: ['user', 'permittype'] });
              if (!item) throw new NotFoundException('Application not found');
              return item;
            }

            async create(dto: CreateApplicationDto) {
              const data: any = { ...dto };
              data.user = { id: dto.userid };
    data.permittype = { id: dto.permittypeid };
              delete data.userid;
    delete data.permittypeid;
              return this.repo.save(this.repo.create(data));
            }

            async update(id: number, dto: UpdateApplicationDto) {
              const item = await this.findOne(id);
              const data: any = { ...dto };
              if (dto.userid !== undefined) data.user = { id: dto.userid };
    if (dto.permittypeid !== undefined) data.permittype = { id: dto.permittypeid };
              delete data.userid;
    delete data.permittypeid;
              Object.assign(item, data);
              return this.repo.save(item);
            }

            async remove(id: number) {
              const item = await this.findOne(id);
              await this.repo.remove(item);
              return { deleted: true, id };
            }

            async count() {
              return { total: await this.repo.count() };
            }
          }
