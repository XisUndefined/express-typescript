import app from "./app";

const port: string | number = process.env.PORT || 3000;

app.listen(port, () => [
  console.log(`Server listening to http://localhost:${port}`),
]);
