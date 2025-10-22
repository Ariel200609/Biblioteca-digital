export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public role: 'ADMIN' | 'LIBRARIAN' | 'READER',
        public createdAt: Date = new Date()
    ) {}
}