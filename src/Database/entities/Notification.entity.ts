import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User.entity";

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, { eager: true })
    user!: User;

    @Column({ type: 'varchar' })
    userId!: string;

    @Column({ type: 'text' })
    message!: string;

    @Column({ type: 'varchar', default: 'SYSTEM' })
    type!: 'LOAN_CREATED' | 'LOAN_DUE' | 'LOAN_OVERDUE' | 'LOAN_RETURNED' | 'LOAN_RENEWED' | 'BOOK_AVAILABLE' | 'SYSTEM';

    @Column({ type: 'boolean', default: false })
    read: boolean = false;

    @Column({ type: 'simple-json' })
    metadata!: {
        timestamp: Date;
        [key: string]: any;
    };

    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;

    constructor(partial: Partial<Notification> = {}) {
        Object.assign(this, partial);
    }
}