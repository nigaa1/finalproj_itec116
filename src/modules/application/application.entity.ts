import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { PermitType } from '../permittype/permittype.entity';

          @Entity('applications')
          export class Application {
            @PrimaryGeneratedColumn() id: number;
            @Column({ name: 'BusinessName', type: 'varchar', length: 255 }) businessname: string;
@Column({ name: 'Status', type: 'enum', nullable: true, enum: ['pending','approved','rejected'] }) status: string;
@Column({ name: 'SubmittedAt', type: 'datetime', nullable: true }) submittedat: Date;
@ManyToOne(() => User, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'UserID' }) user: User;
@ManyToOne(() => PermitType, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'PermitTypeID' }) permittype: PermitType;
            @CreateDateColumn() createdAt: Date;
            @UpdateDateColumn() updatedAt: Date;
          }
