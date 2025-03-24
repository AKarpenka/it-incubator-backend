import { Router, Request, Response } from "express";
import { db } from "../../db/db";
import { TDataBase } from "../../types/TDataBase";

export const testingRouter = Router();

// Deleting of all data from DB
testingRouter.delete('/all-data',  (req: Request, res: Response) => {
    Object.keys(db).forEach((key) => db[key as keyof TDataBase] = []);
    
    res
        .status(204)
        .send('All data is deleted');
});
