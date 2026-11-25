import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
@Module({ imports: [TypeOrmModule.forFeature([Application])], controllers: [ApplicationController], providers: [ApplicationService] })
export class ApplicationModule {}
