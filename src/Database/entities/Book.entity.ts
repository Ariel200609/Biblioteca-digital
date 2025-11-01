import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar' })
    title!: string;

    @Column({ type: 'varchar' })
    author!: string;

    @Column({ type: 'varchar' })
    isbn!: string;

    @Column({ type: 'varchar' })
    category!: string;

    @Column("text")
    description!: string;

    @Column({ type: 'boolean', default: true })
    available: boolean = true;

    @Column({ type: 'int', default: 0 })
    timesLoaned: number = 0;

    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt!: Date;

    constructor(partial: Partial<Book> = {}) {
        Object.assign(this, partial);
    }
}