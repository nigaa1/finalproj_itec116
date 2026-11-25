import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationDocument } from './applicationdocument.entity';
import { ApplicationDocumentService } from './applicationdocument.service';
import { ApplicationDocumentController } from './applicationdocument.controller';
@Module({ imports: [TypeOrmModule.forFeature([ApplicationDocument])], controllers: [ApplicationDocumentController], providers: [ApplicationDocumentService] })
export class ApplicationDocumentModule {}
