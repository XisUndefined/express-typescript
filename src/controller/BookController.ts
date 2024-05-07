import AsyncErrorHandler from "../utils/AsyncErrorHandler";
import { ResponseError } from "../utils/ResponseError";
import { Request, Response, NextFunction } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Book {
  id?: number;
  title: string;
  author: string;
  publishDate: number;
  genre: string;
}

export default class BookController {
  static getAllBooks = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await fs.promises.readFile(
        path.join(__dirname, "../data/books.json"),
        "utf-8"
      );
      const books = JSON.parse(response);
      res.status(200).json({
        status: "success",
        data: books,
      });
    }
  );

  static getBookById = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const response = await fs.promises.readFile(
        path.join(__dirname, "../data/books.json"),
        "utf-8"
      );
      const books = JSON.parse(response);
      const filteredBook = books.filter(
        (book: Book) => book.id === parseInt(id)
      );

      if (!filteredBook.length) {
        const error = new ResponseError("No product with given ID", 404);
        return next(error);
      }

      res.status(200).json({
        status: "success",
        data: filteredBook,
      });
    }
  );

  static createBook = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { title, author, publishDate, genre }: Book = req.body;
      if (!title || !author || !publishDate || !genre) {
        const error = new ResponseError("Fill all field data", 403);
        return next(error);
      }
      const response = await fs.promises.readFile(
        path.join(__dirname, "../data/books.json"),
        "utf-8"
      );
      const books = JSON.parse(response);
      const checkBooks = books.filter((book: Book) => book.title === title);

      if (checkBooks.length) {
        const error = new ResponseError(
          "Book with given title already exist",
          409
        );
        return next(error);
      }

      const newBookData = {
        id: books.length + 1,
        title,
        author,
        publish_date: publishDate,
        genre,
      };

      books.push(newBookData);

      await fs.promises.writeFile(
        path.join(__dirname, "../data/books.json"),
        JSON.stringify(books),
        "utf-8"
      );
      res.status(209).json({
        status: "success",
        message: "Book created successfully",
        data: newBookData,
      });
    }
  );

  static updateBookById = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { title, author, publishDate, genre }: Book = req.body;

      const response = await fs.promises.readFile(
        path.join(__dirname, "../data/books.json"),
        "utf-8"
      );
      const books = JSON.parse(response);
      const filteredBooks = books.filter(
        (book: Book) => book.id === parseInt(id)
      );

      if (!filteredBooks.length) {
        const error = new ResponseError("No book with given ID", 404);
        return next(error);
      }

      const newBookData = [
        { id: parseInt(id), title, author, publish_data: publishDate, genre },
        ...books.filter((book: Book) => book.id !== parseInt(id)),
      ];

      await fs.promises.writeFile(
        path.join(__dirname, "../data/books.json"),
        JSON.stringify(newBookData),
        "utf-8"
      );
      res.status(200).json({
        status: "success",
        message: "Book has been updated",
        data: newBookData,
      });
    }
  );

  static deleteBookById = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const response = await fs.promises.readFile(
        path.join(__dirname, "../data/books.json"),
        "utf-8"
      );
      const books = JSON.parse(response);
      const filteredBooks = books.filter(
        (book: Book) => book.id === parseInt(id)
      );

      if (!filteredBooks.length) {
        const error = new ResponseError("No book with given ID", 404);
        return next(error);
      }

      const deletedBook = books.filter(
        (book: Book) => book.id !== parseInt(id)
      );
      await fs.promises.writeFile(
        path.join(__dirname, "../data/books.json"),
        JSON.stringify(deletedBook),
        "utf-8"
      );

      res.status(204).json({
        status: "success",
        message: "Book has been deleted",
      });
    }
  );
}
