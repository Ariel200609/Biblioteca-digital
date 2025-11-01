import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { Book } from "./Book.entity";

@Entity('loans')
export class Loan {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, { eager: true })
    user!: User;

    @ManyToOne(() => Book, { eager: true })
    book!: Book;

    @Column({ type: 'varchar' })
    userId!: string;

    @Column({ type: 'varchar' })
    bookId!: string;

    @Column({ type: 'datetime' })
    dueDate!: Date;

    @Column({ type: 'varchar', default: 'ACTIVE' })
    status: string = 'ACTIVE';

    @Column({ type: 'int', default: 0 })
    renewalCount: number = 0;

    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt!: Date;

    constructor(partial: Partial<Loan> = {}) {
        Object.assign(this, partial);
    }
}