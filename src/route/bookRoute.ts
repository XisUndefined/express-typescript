import express from "express";
import BookController from "../controller/BookController";

const router = express.Router();

router
  .route("/")
  .get(BookController.getAllBooks)
  .post(BookController.createBook);
router
  .route("/:id")
  .get(BookController.getBookById)
  .delete(BookController.deleteBookById)
  .patch(BookController.updateBookById);

export default router;
