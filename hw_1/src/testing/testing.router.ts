import { Router } from "express";
import {testingController } from "./testingController";

export const testingRouter = Router();

//удаление БД
testingRouter.delete('/all-data', testingController.deleteDB);