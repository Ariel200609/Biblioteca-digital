export class User {
    public isActive: boolean = true;
    
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public role: 'ADMIN' | 'LIBRARIAN' | 'READER',
        public createdAt: Date = new Date()
    ) {}
}