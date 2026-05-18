import Book, { BookData, BookFormat, BookStatus } from "./Book.js";

const form = document.getElementById("bookForm") as HTMLFormElement;
const booksList = document.getElementById("booksList") as HTMLDivElement;
const totalFinishedBooks = document.getElementById("totalFinishedBooks") as HTMLParagraphElement;
const totalPagesRead = document.getElementById("totalPagesRead") as HTMLParagraphElement;
const message = document.getElementById("message") as HTMLParagraphElement;
const submitButton = document.getElementById("submitButton") as HTMLButtonElement;

let editingBookId: string | null = null;

async function getBooks(): Promise<void> {
  const response = await fetch("/api/books");
  const books: BookData[] = await response.json();

  displayBooks(books);
  displayStats(books);
}

function displayBooks(books: BookData[]): void {
  booksList.innerHTML = "";

  books.forEach((bookData) => {
    const book = new Book(bookData);
    const percentage = book.currentlyAt();

    const bookCard = document.createElement("div");
    bookCard.className = "bg-white shadow rounded-lg p-5 border border-gray-200";

    bookCard.innerHTML = `
      <div class="flex justify-between gap-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800">${book.title}</h3>
          <p class="text-gray-600">Auteur : ${book.author}</p>
          <p class="text-gray-600">Format : ${book.format}</p>
          <p class="text-gray-600">Statut : ${book.status}</p>
          <p class="text-gray-600">Prix : ${book.price} DH</p>
          <p class="text-gray-600">Suggéré par : ${book.suggestedBy || "Non précisé"}</p>
        </div>

        <div class="flex flex-col gap-2">
          <button class="edit-btn bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded">
            Modifier
          </button>

          <button class="delete-btn bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">
            Supprimer
          </button>
        </div>
      </div>

      <div class="mt-4">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>${book.pagesRead} / ${book.numberOfPages} pages</span>
          <span>${percentage}%</span>
        </div>

        <div class="w-full bg-gray-200 rounded-full h-3">
          <div class="bg-blue-600 h-3 rounded-full" style="width: ${percentage}%"></div>
        </div>
      </div>

      <p class="mt-3 font-semibold ${book.finished ? "text-green-600" : "text-orange-500"}">
        ${book.finished ? "Livre terminé" : "Livre non terminé"}
      </p>
    `;

    const editButton = bookCard.querySelector(".edit-btn") as HTMLButtonElement;

    editButton.addEventListener("click", () => {
      editingBookId = book.id || null;

      (document.getElementById("title") as HTMLInputElement).value = book.title;
      (document.getElementById("author") as HTMLInputElement).value = book.author;
      (document.getElementById("numberOfPages") as HTMLInputElement).value = String(book.numberOfPages);
      (document.getElementById("status") as HTMLSelectElement).value = book.status;
      (document.getElementById("price") as HTMLInputElement).value = String(book.price);
      (document.getElementById("pagesRead") as HTMLInputElement).value = String(book.pagesRead);
      (document.getElementById("format") as HTMLSelectElement).value = book.format;
      (document.getElementById("suggestedBy") as HTMLInputElement).value = book.suggestedBy;

      submitButton.textContent = "Modifier";
      message.textContent = "Modification du livre en cours.";
      message.className = "text-yellow-600 font-semibold mb-4";
    });

    const deleteButton = bookCard.querySelector(".delete-btn") as HTMLButtonElement;

    deleteButton.addEventListener("click", async () => {
      await book.deleteBook();
      getBooks();
    });

    booksList.appendChild(bookCard);
  });
}

function displayStats(books: BookData[]): void {
  const finishedBooks = books.filter((book) => book.finished === true);
  const pagesRead = books.reduce((total, book) => total + book.pagesRead, 0);

  totalFinishedBooks.textContent = String(finishedBooks.length);
  totalPagesRead.textContent = String(pagesRead);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const numberOfPages = Number((document.getElementById("numberOfPages") as HTMLInputElement).value);
  const pagesRead = Number((document.getElementById("pagesRead") as HTMLInputElement).value);

  if (pagesRead > numberOfPages) {
    message.textContent = "Le nombre de pages lues ne peut pas dépasser le nombre total de pages.";
    message.className = "text-red-600 font-semibold mb-4";
    return;
  }

  const book = new Book({
    title: (document.getElementById("title") as HTMLInputElement).value,
    author: (document.getElementById("author") as HTMLInputElement).value,
    numberOfPages,
    status: (document.getElementById("status") as HTMLSelectElement).value as BookStatus,
    price: Number((document.getElementById("price") as HTMLInputElement).value),
    pagesRead,
    format: (document.getElementById("format") as HTMLSelectElement).value as BookFormat,
    suggestedBy: (document.getElementById("suggestedBy") as HTMLInputElement).value
  });

  const url = editingBookId ? `/api/books/${editingBookId}` : "/api/books";
  const method = editingBookId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  });

  const result = await response.json();

  if (!response.ok) {
    message.textContent = result.message;
    message.className = "text-red-600 font-semibold mb-4";
    return;
  }

  message.textContent = editingBookId
    ? "Livre modifié avec succès."
    : "Livre ajouté avec succès.";

  message.className = "text-green-600 font-semibold mb-4";

  editingBookId = null;
  submitButton.textContent = "Ajouter";

  form.reset();
  getBooks();
});

getBooks();
