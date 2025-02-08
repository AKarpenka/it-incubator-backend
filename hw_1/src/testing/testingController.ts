import { Request, Response } from "express";
import { db } from "../db";
import { TDataBase } from "../types";

export const testingController = {
    deleteDB: (req: Request, res: Response) => {
        Object.keys(db).forEach((key) => db[key as keyof TDataBase] = []);
        
        res
            .status(204)
            .send('All data is deleted');
    }
}