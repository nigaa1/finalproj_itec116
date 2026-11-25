import { Injectable, NotFoundException } from '@nestjs/common';
          import { InjectRepository } from '@nestjs/typeorm';
          import { Repository } from 'typeorm';
          import { Payment } from './payment.entity';
          import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';

          @Injectable()
          export class PaymentService {
            constructor(@InjectRepository(Payment) private readonly repo: Repository<Payment>) {}

            findAll() {
              return this.repo.find({ relations: ['application'], order: { id: 'DESC' } });
            }

            async findOne(id: number) {
              const item = await this.repo.findOne({ where: { id }, relations: ['application'] });
              if (!item) throw new NotFoundException('Payment not found');
              return item;
            }

            async create(dto: CreatePaymentDto) {
              const data: any = { ...dto };
              data.application = { id: dto.applicationid };
              delete data.applicationid;
              return this.repo.save(this.repo.create(data));
            }

            async update(id: number, dto: UpdatePaymentDto) {
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
