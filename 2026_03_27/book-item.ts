import { Book } from './book.ts'

enum BookStatus {
    AVAILABLE = 'AVAILABLE',
    LOANED = 'LOANED',
}

export class BookItem {
    private _status: BookStatus = BookStatus.AVAILABLE

    constructor(
        public id: string,
        public book: Book
    ) {}

    isAvailable(): boolean {
        return this._status === BookStatus.AVAILABLE
    }

    markAsLoaned() {
        this._status = BookStatus.LOANED
    }

    markAsAvailable() {
        this._status = BookStatus.AVAILABLE
    }

    set status(s: BookStatus) {
        this._status = s
    }

    get status() {
        return this._status
    }
}

const b = new Book('1235', 'Machado de Assis', 'Dom Casmurro')
const bi = new BookItem('1234', b)
console.log(bi.status)

bi.status = BookStatus.AVAILABLE