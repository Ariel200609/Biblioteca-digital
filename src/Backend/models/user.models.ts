export class User {
    public isActive: boolean = true;
    
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public role: 'admin' | 'librarian' | 'reader',
        public createdAt: Date = new Date(),
        public activeLoans: number = 0
    ) {}
}