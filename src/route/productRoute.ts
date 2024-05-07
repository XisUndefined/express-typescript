import express from "express";
import ProductController from "../controller/ProductController";

const router = express.Router();

router
  .route("/")
  .get(ProductController.getAllProducts)
  .post(ProductController.createProduct);
router
  .route("/:id")
  .get(ProductController.getProductById)
  .delete(ProductController.deleteProductById)
  .patch(ProductController.updateProductById);

export default router;
