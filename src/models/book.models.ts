export class Book {
    constructor(
        public id: string,
        public title: string,
        public author: string,
        public isbn: string,
        public category: string,
        public available: boolean = true,
        public borrowCount: number = 0,
        public createdAt: Date = new Date()
    ) {}

    incrementBorrowCount(): void {
        this.borrowCount++;
    }
}