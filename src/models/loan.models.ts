export class Loan {
    constructor(
        public id: string,
        public userId: string,
        public bookId: string,
        public loanDate: Date,
        public dueDate: Date,
        public returnDate?: Date
    ) {}
}