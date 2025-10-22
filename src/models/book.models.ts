export class Book {
    constructor(
        public id: string,
        public title: string,
        public author: string,
        public isbn: string,
        public category: string,
        public available: boolean = true,
        public createdAt: Date = new Date()
    ) {}
}