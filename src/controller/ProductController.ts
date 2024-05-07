import AsyncErrorHandler from "../utils/AsyncErrorHandler";
import { ResponseError } from "../utils/ResponseError";
import { Request, Response, NextFunction } from "express";
import fs from "node:fs";
import path from "node:path";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

export default class ProductController {
  static getAllProducts = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await fs.promises.readFile(
        path.join(__dirname, "./../../data/products.json"),
        "utf-8"
      );
      const products = JSON.parse(response);
      res.status(200).json({
        status: "success",
        data: products,
      });
    }
  );

  static getProductById = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const response = await fs.promises.readFile(
        path.join(__dirname, "./../../data/products.json"),
        "utf-8"
      );
      const products = JSON.parse(response);
      const filteredProduct = products.filter(
        (product: Product) => product.id === parseInt(id)
      );

      if (!filteredProduct.length) {
        const error = new ResponseError("No product with given ID", 404);
        return next(error);
      }

      res.status(200).json({
        status: "success",
        data: filteredProduct,
      });
    }
  );

  static createProduct = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, description, price, category } = req.body;
      if (!name || !description || !price || !category) {
        const error = new ResponseError("Fill all field data", 403);
        return next(error);
      }
      const response = await fs.promises.readFile(
        path.join(__dirname, "./../../data/products.json"),
        "utf-8"
      );
      const products = JSON.parse(response);
      const checkProduct = products.filter(
        (product: Product) => product.name === name
      );

      if (checkProduct.length) {
        const error = new ResponseError(
          "Product with given name already exist",
          409
        );
        return next(error);
      }

      const newProductData = {
        id: products.length + 1,
        name,
        description,
        price: parseInt(price),
        category,
      };

      products.push(newProductData);

      await fs.promises.writeFile(
        path.join(__dirname, "./../../data/products.json"),
        JSON.stringify(products),
        "utf-8"
      );
      res.status(209).json({
        status: "success",
        message: "Product created successfully",
        data: newProductData,
      });
    }
  );

  static updateProductById = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { name, description, price, category } = req.body;
      if (!name || !description || !price || !category) {
        const error = new ResponseError("Fill all field data", 403);
        return next(error);
      }

      const response = await fs.promises.readFile(
        path.join(__dirname, "./../../data/products.json"),
        "utf-8"
      );
      const products = JSON.parse(response);
      const filteredProducts = products.filter(
        (product: Product) => product.id === parseInt(id)
      );

      if (!filteredProducts.length) {
        const error = new ResponseError("No product with given ID", 404);
        return next(error);
      }

      const newProductData = [
        {
          id: parseInt(id),
          name,
          description,
          price: parseInt(price),
          category,
        },
        ...products.filter((product: Product) => product.id !== parseInt(id)),
      ].sort((a, b) => a.id - b.id);

      await fs.promises.writeFile(
        path.join(__dirname, "./../../data/products.json"),
        JSON.stringify(newProductData),
        "utf-8"
      );
      res.status(200).json({
        status: "success",
        message: "Product has been updated",
        data: {
          id: parseInt(id),
          name,
          description,
          price: parseInt(price),
          category,
        },
      });
    }
  );

  static deleteProductById = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const response = await fs.promises.readFile(
        path.join(__dirname, "./../../data/products.json"),
        "utf-8"
      );
      const products = JSON.parse(response);
      const filteredProducts = products.filter(
        (product: Product) => product.id === parseInt(id)
      );

      if (!filteredProducts.length) {
        const error = new ResponseError("No product with given ID", 404);
        return next(error);
      }

      const deletedProduct = products.filter(
        (product: Product) => product.id !== parseInt(id)
      );
      await fs.promises.writeFile(
        path.join(__dirname, "./../../data/products.json"),
        JSON.stringify(deletedProduct),
        "utf-8"
      );

      res.status(202).json({
        status: "success",
        message: "Product has been deleted",
      });
    }
  );
}
