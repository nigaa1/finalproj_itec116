import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitType } from './permittype.entity';
import { PermitTypeService } from './permittype.service';
import { PermitTypeController } from './permittype.controller';
@Module({ imports: [TypeOrmModule.forFeature([PermitType])], controllers: [PermitTypeController], providers: [PermitTypeService] })
export class PermitTypeModule {}
