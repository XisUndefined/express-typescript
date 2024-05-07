import express from "express";
import PeopleController from "../controller/PeopleController";

const router = express.Router();

router
  .route("/")
  .get(PeopleController.getAllPeople)
  .post(PeopleController.createPeople);
router
  .route("/:id")
  .get(PeopleController.getPeopleByID)
  .delete(PeopleController.deletePeopleById)
  .patch(PeopleController.updatePeopleById);

export default router;
