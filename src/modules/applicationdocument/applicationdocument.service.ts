import { Injectable, NotFoundException } from '@nestjs/common';
          import { InjectRepository } from '@nestjs/typeorm';
          import { Repository } from 'typeorm';
          import { ApplicationDocument } from './applicationdocument.entity';
          import { CreateApplicationDocumentDto, UpdateApplicationDocumentDto } from './applicationdocument.dto';

          @Injectable()
          export class ApplicationDocumentService {
            constructor(@InjectRepository(ApplicationDocument) private readonly repo: Repository<ApplicationDocument>) {}

            findAll() {
              return this.repo.find({ relations: ['application'], order: { id: 'DESC' } });
            }

            async findOne(id: number) {
              const item = await this.repo.findOne({ where: { id }, relations: ['application'] });
              if (!item) throw new NotFoundException('ApplicationDocument not found');
              return item;
            }

            async create(dto: CreateApplicationDocumentDto) {
              const data: any = { ...dto };
              data.application = { id: dto.applicationid };
              delete data.applicationid;
              return this.repo.save(this.repo.create(data));
            }

            async update(id: number, dto: UpdateApplicationDocumentDto) {
              const item = await this.findOne(id);
              const data: any = { ...dto };
              if (dto.applicationid !== undefined) data.application = { id: dto.applicationid };
              delete data.applicationid;
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
