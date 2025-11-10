import { DataSource } from "typeorm";
import { Book } from "../entities/Book.entity";
import { User } from "../entities/User.entity";
import { Loan } from "../entities/Loan.entity";
import { Notification } from "../entities/Notification.entity";

export const TestDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [Book, User, Loan, Notification],
    synchronize: true,
    logging: false,
    dropSchema: true
});