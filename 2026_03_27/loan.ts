import { BookItem } from "./book-item.ts"
import { Member } from "./member.ts"

export class Loan {
    returnedAt?: Date

    constructor(
        public bookItem: BookItem,
        public member: Member,
        public borrowedAt: Date,
        public dueDate: Date
    ){}

    returnBook(date: Date) {
        this.returnedAt = date;
        this.bookItem.markAsAvailable();
    }

    isLate(currentDate: Date): boolean {
        return currentDate > this.dueDate && !this.returnedAt
    }
}