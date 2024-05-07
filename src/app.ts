// IMPORT PACKAGE
import express, { Express } from "express";

// IMPORT ROUTES

// IMPORT CONTROLLER AND HANDLER
import { globalErrorMiddleware } from "./middleware/errorMiddleware";

export const app: Express = express();

// MIDDLEWARE
app.use(express.urlencoded());
app.use(express.json());

// USE ROUTE

// GLOBAL ERROR HANDLER
app.use(globalErrorMiddleware);
