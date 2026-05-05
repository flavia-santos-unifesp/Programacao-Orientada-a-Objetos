import { Loan } from "./loan.ts";

export enum MemberType {
    REGULAR = "REGULAR",
    PREMIUM = "PREMIUM"
}

export class Member {
    activeLoans: Loan[] = []
    blockedUntil?: Date

    constructor(
        public id: string,
        public name: string,
        public type: MemberType
    ) {}

    canBorrow(): boolean {
        if (this.blockedUntil && new Date() <= this.blockedUntil) {
            return false;
        }

        // máximo 3 empréstimos simultâneos
        if (this.activeLoans.length >= 3) {
            return false;
        }

        return true;
    }

    addLoan(loan: Loan) {
        this.activeLoans.push(loan)
    }

    removeLoan(loan: Loan) {
        this.activeLoans = this.activeLoans.filter(l => l !== loan)
    }

    blockUntil(date: Date) {
        this.blockedUntil = date
        console.log(`Membro será bloqueado até ${date.toDateString()}`)
    }

    getLoans(): Loan[] {
        return [...this.activeLoans]
    }
}