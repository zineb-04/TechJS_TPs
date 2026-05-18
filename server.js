const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((error) => console.log("Erreur MongoDB :", error));

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  numberOfPages: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: [
      "Read",
      "Re-read",
      "DNF",
      "Currently reading",
      "Returned Unread",
      "Want to read"
    ],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  pagesRead: {
    type: Number,
    required: true,
    min: 0
  },
  format: {
    type: String,
    enum: ["Print", "PDF", "Ebook", "AudioBook"],
    required: true
  },
  suggestedBy: {
    type: String,
    default: ""
  },
  finished: {
    type: Boolean,
    default: false
  }
});

bookSchema.pre("save", function () {
  if (this.pagesRead > this.numberOfPages) {
    throw new Error("Le nombre de pages lues ne peut pas dépasser le nombre total de pages.");
  }

  this.finished = this.pagesRead === this.numberOfPages;
});

const BookModel = mongoose.model("Book", bookSchema);

app.get("/api/books", async (req, res) => {
  try {
    const books = await BookModel.find().sort({ _id: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des livres." });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const book = new BookModel(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    if (req.body.pagesRead > req.body.numberOfPages) {
      return res.status(400).json({
        message: "Le nombre de pages lues ne peut pas dépasser le nombre total de pages."
      });
    }

    req.body.finished = req.body.pagesRead === req.body.numberOfPages;

    const updatedBook = await BookModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Livre supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du livre." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
