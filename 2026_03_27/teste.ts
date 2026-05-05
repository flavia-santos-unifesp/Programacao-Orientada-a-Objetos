import { Book } from "./book.ts";
import { BookItem } from "./book-item.ts";
import { Library } from "./library.ts";
import { Member, MemberType } from "./member.ts";

const library = new Library();

// Criar livro
const book = new Book("121212", "Brandon Sanderson", "Mistborn I");

// Criar cópias
const copy1 = new BookItem("c1", book);
const copy2 = new BookItem("c2", book);

// Criar membro
const member = new Member("m1", "Rennan", MemberType.REGULAR);

// Adicionar no acervo
library.addBookItem(copy1);
library.addBookItem(copy2);

console.log("\nBiblioteca inicializada");

const loan1 = library.borrowBook("121212", member);

// teste os limites
try {
    const loan2 = library.borrowBook("121212", member);
    const loan3 = library.borrowBook("121212", member);
    //ultrapassa a quantidade atual
    const loan4 = library.borrowBook("121212", member);
} catch (e) {
    console.log((e as Error).message);
}

// livro isdisponivel
try {
    const outro = new Member("m2", "Gabriel", MemberType.PREMIUM);
    library.borrowBook("121212", outro);
} catch (e) {
    console.log((e as Error).message);
}

// simular atraso manual
loan1.dueDate.setDate(loan1.dueDate.getDate() - 5);
library.returnBook(loan1);