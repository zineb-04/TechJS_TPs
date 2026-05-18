var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export var BookStatus;
(function (BookStatus) {
    BookStatus["Read"] = "Read";
    BookStatus["ReRead"] = "Re-read";
    BookStatus["DNF"] = "DNF";
    BookStatus["CurrentlyReading"] = "Currently reading";
    BookStatus["ReturnedUnread"] = "Returned Unread";
    BookStatus["WantToRead"] = "Want to read";
})(BookStatus || (BookStatus = {}));
export var BookFormat;
(function (BookFormat) {
    BookFormat["Print"] = "Print";
    BookFormat["PDF"] = "PDF";
    BookFormat["Ebook"] = "Ebook";
    BookFormat["AudioBook"] = "AudioBook";
})(BookFormat || (BookFormat = {}));
export default class Book {
    constructor(data) {
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
    currentlyAt() {
        return Math.round((this.pagesRead / this.numberOfPages) * 100);
    }
    deleteBook() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id) {
                return;
            }
            yield fetch(`/api/books/${this.id}`, {
                method: "DELETE"
            });
        });
    }
}
