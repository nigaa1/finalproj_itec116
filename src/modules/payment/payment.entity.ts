import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from '../application/application.entity';

          @Entity('payments')
          export class Payment {
            @PrimaryGeneratedColumn() id: number;
            @Column({ name: 'Amount', type: 'decimal', precision: 12, scale: 2 }) amount: number;
@Column({ name: 'PaymentMethod', type: 'varchar', length: 255 }) paymentmethod: string;
@Column({ name: 'PaidAt', type: 'datetime', nullable: true }) paidat: Date;
@ManyToOne(() => Application, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'ApplicationID' }) application: Application;
            @CreateDateColumn() createdAt: Date;
            @UpdateDateColumn() updatedAt: Date;
          }
