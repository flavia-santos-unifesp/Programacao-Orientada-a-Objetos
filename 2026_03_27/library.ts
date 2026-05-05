import { BookItem } from "./book-item.ts";
import { Loan } from "./loan.ts";
import { Member, MemberType } from "./member.ts";

export class Library {
    bookItems: BookItem[] = [];
    loans: Loan[] = [];

    addBookItem(item: BookItem) {
        this.bookItems.push(item)
    }

    borrowBook(bookId: string, member: Member): Loan {
        console.log(`\nTentando emprestar livro para ${member.name}...`);

        if (!member.canBorrow()) {
            throw new Error("Membro ultrapassou o limite de emprestimos");
        }

        const copies = this.bookItems.filter(
            bi => bi.book.id === bookId
        )

        if (copies.length === 0) {
            throw new Error("Livro não existe no acervo");
        }

        const availableCopy = copies.find(c => c.isAvailable())

        if (!availableCopy) {
            throw new Error("Desculpe! nenhuma copia disponivel no acervo");
        }

        const now = new Date()

        const dueDate = new Date(now);
        if (member.type === MemberType.REGULAR) {
            dueDate.setDate(dueDate.getDate() + 14)
        } else {
            dueDate.setDate(dueDate.getDate() + 30)
        }

        const loan = new Loan(availableCopy, member, now, dueDate)

        availableCopy.markAsLoaned()
        member.addLoan(loan)
        this.loans.push(loan);

        console.log(` Livro emprestado: ${availableCopy.book.title}`);
        console.log(` Data limite para devolução: ${dueDate.toDateString()}`);
        console.log(` Status: ${availableCopy.status}`);

        return loan;
    }

    returnBook(loan: Loan) {
        console.log(`\n Devolvendo livro: ${loan.bookItem.book.title}`);

        const now = new Date();

        loan.returnBook(now);
        loan.member.removeLoan(loan);

        console.log(`Status após devolução: ${loan.bookItem.status}`);

        // Regra da penalidade por tipo
        const delay = Math.ceil(
            (now.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (delay > 0) {
            console.log(` Atraso de ${delay} dias`);

            if (loan.member.type === MemberType.REGULAR) {
                const blockUntil = new Date(now);
                blockUntil.setDate(blockUntil.getDate() + delay);
                loan.member.blockUntil(blockUntil);
            }

            if (loan.member.type === MemberType.PREMIUM) {
                if (delay > 3) {
                    const blockUntil = new Date(now);
                    blockUntil.setDate(blockUntil.getDate() + delay);
                    loan.member.blockUntil(blockUntil);
                }
            }
        }
    }
}