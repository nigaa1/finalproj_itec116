import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


          @Entity('permit_types')
          export class PermitType {
            @PrimaryGeneratedColumn() id: number;
            @Column({ name: 'PermitName', type: 'varchar', length: 255 }) permitname: string;
@Column({ name: 'Description', type: 'text', nullable: true }) description: string;
@Column({ name: 'Fee', type: 'decimal', precision: 12, scale: 2 }) fee: number;
            @CreateDateColumn() createdAt: Date;
            @UpdateDateColumn() updatedAt: Date;
          }
