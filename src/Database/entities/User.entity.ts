import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'varchar', default: 'reader' })
    role!: 'admin' | 'librarian' | 'reader';

    @Column({ type: 'boolean', default: true })
    isActive: boolean = true;

    @Column({ type: 'int', default: 0 })
    activeLoans: number = 0;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    constructor(partial: Partial<User> = {}) {
        Object.assign(this, partial);
    }
}