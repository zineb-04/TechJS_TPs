// Enum pour définir les statuts possibles d'un livre
export enum BookStatus {
  Read = "Read",
  ReRead = "Re-read",
  DNF = "DNF",
  CurrentlyReading = "Currently reading",
  ReturnedUnread = "Returned Unread",
  WantToRead = "Want to read"
}

// Enum pour définir les formats possibles d'un livre
export enum BookFormat {
  Print = "Print",
  PDF = "PDF",
  Ebook = "Ebook",
  AudioBook = "AudioBook"
}

// Interface qui définit la structure d'un livre
export interface BookData {
  _id?: string;
  title: string;
  author: string;
  numberOfPages: number;
  status: BookStatus;
  price: number;
  pagesRead: number;
  format: BookFormat;
  suggestedBy: string;
  finished?: boolean;
}

// Classe Book qui représente un livre dans l'application
export default class Book {
  id?: string;
  title: string;
  author: string;
  numberOfPages: number;
  status: BookStatus;
  price: number;
  pagesRead: number;
  format: BookFormat;
  suggestedBy: string;
  finished: boolean;

  constructor(data: BookData) {
    this.id = data._id;
    this.title = data.title;
    this.author = data.author;
    this.numberOfPages = data.numberOfPages;
    this.status = data.status;
    this.price = data.price;
    this.pagesRead = data.pagesRead;
    this.format = data.format;
    this.suggestedBy = data.suggestedBy;
    this.finished = this.pagesRead === this.numberOfPages;
  }

  currentlyAt(): number {
    return Math.round((this.pagesRead / this.numberOfPages) * 100);
  }

  async deleteBook(): Promise<void> {
    if (!this.id) {
      return;
    }

    await fetch(`/api/books/${this.id}`, {
      method: "DELETE"
    });
  }
}
