// IMPORT PACKAGE
import express, { Express } from "express";

// IMPORT ROUTES
import peopleRoute from "./route/peopleRoute";
import productRoute from "./route/productRoute";
import bookRoute from "./route/bookRoute";

// IMPORT CONTROLLER AND HANDLER
import { globalErrorMiddleware } from "./middleware/errorMiddleware";
import { ResponseError } from "./utils/ResponseError";

const app: Express = express();

// MIDDLEWARE
app.use(express.urlencoded());
app.use(express.json());

// USE ROUTE
app.use("/api/v1/people", peopleRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/books", bookRoute);

app.all("*", (req, res, next) => {
  const err = new ResponseError(
    "The resource requested could not be found on the server",
    404
  );
  next(err);
});

// GLOBAL ERROR HANDLER
app.use(globalErrorMiddleware);

export default app;
