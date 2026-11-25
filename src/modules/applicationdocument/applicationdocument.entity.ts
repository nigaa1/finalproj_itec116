import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from '../application/application.entity';

          @Entity('application_documents')
          export class ApplicationDocument {
            @PrimaryGeneratedColumn() id: number;
            @Column({ name: 'FileName', type: 'varchar', length: 255 }) filename: string;
@Column({ name: 'FilePath', type: 'varchar', length: 255 }) filepath: string;
@Column({ name: 'UploadedAt', type: 'datetime', nullable: true }) uploadedat: Date;
@ManyToOne(() => Application, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'ApplicationID' }) application: Application;
            @CreateDateColumn() createdAt: Date;
            @UpdateDateColumn() updatedAt: Date;
          }
