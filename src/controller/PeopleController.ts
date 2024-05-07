import AsyncErrorHandler from "../utils/AsyncErrorHandler";
import { ResponseError } from "../utils/ResponseError";
import { Request, Response, NextFunction } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Person {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default class PeopleController {
  static getAllPeople = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await fs.promises.readFile(
        path.join(__dirname, "../data/people.json"),
        "utf-8"
      );
      const people = JSON.parse(response);
      res.status(200).json({
        status: "success",
        data: people,
      });
    }
  );

  static getPeopleByID = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const response = await fs.promises.readFile(
        path.join(__dirname, "../data/people.json"),
        "utf-8"
      );
      const people = JSON.parse(response);
      const filteredPeople = people.filter(
        (person: Person) => person.id === parseInt(id)
      );

      if (!filteredPeople.length) {
        const error = new ResponseError("No user with given ID", 404);
        return next(error);
      }

      res.status(200).json({
        status: "success",
        data: filteredPeople,
      });
    }
  );

  static createPeople = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id, name, username, email } = req.body;
      if (!id || !name || !username || !email) {
        const error = new ResponseError("Fill all field data", 403);
        return next(error);
      }
      const response = await fs.promises.readFile(
        path.join(__dirname, "../data/people.json"),
        "utf-8"
      );
      const people = JSON.parse(response);
      const checkPeopleId = people.filter(
        (person: Person) => person.id === parseInt(id)
      );
      const checkPeopleEmail = people.filter(
        (person: Person) => person.email === email
      );

      if (checkPeopleId.length) {
        const error = new ResponseError(
          "User with given ID already registered",
          409
        );
        return next(error);
      }

      if (checkPeopleEmail.length) {
        const error = new ResponseError(
          "User with given email already registered",
          409
        );
        return next(error);
      }

      const newPeopleData = {
        id: parseInt(id),
        name,
        username,
        email,
      };

      people.push(newPeopleData);

      await fs.promises.writeFile(
        path.join(__dirname, "../data/people.json"),
        JSON.stringify(people),
        "utf-8"
      );
      res.status(209).json({
        status: "success",
        message: "User created successfully",
        data: newPeopleData,
      });
    }
  );

  static updatePeopleById = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { name, username, email } = req.body;
      const response = await fs.promises.readFile(
        path.join(__dirname, "../data/people.json"),
        "utf-8"
      );
      const people = JSON.parse(response);
      const filteredPeople = people.filter(
        (person: Person) => person.id === parseInt(id)
      );

      if (!filteredPeople.length) {
        const error = new ResponseError("No user with given ID", 404);
        return next(error);
      }

      const newPeopleData = [
        { id: parseInt(id), name, username, email },
        ...people.filter((person: Person) => person.id !== parseInt(id)),
      ];

      await fs.promises.writeFile(
        path.join(__dirname, "../data/people.json"),
        JSON.stringify(newPeopleData),
        "utf-8"
      );
      res.status(200).json({
        status: "success",
        message: "User has been updated",
      });
    }
  );

  static deletePeopleById = AsyncErrorHandler.wrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const response = await fs.promises.readFile(
        path.join(__dirname, "../data/people.json"),
        "utf-8"
      );
      const people = JSON.parse(response);
      const filteredPeople = people.filter(
        (person: Person) => person.id === parseInt(id)
      );

      if (!filteredPeople.length) {
        const error = new ResponseError("No user with given ID", 404);
        return next(error);
      }

      const deletedPeople = people.filter(
        (person: Person) => person.id !== parseInt(id)
      );
      await fs.promises.writeFile(
        path.join(__dirname, "../data/people.json"),
        JSON.stringify(deletedPeople),
        "utf-8"
      );

      res.status(200).json({
        status: "success",
        message: "User has been deleted",
      });
    }
  );
}
