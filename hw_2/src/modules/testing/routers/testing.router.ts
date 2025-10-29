import { HttpStatus } from '../../../core/types/httpStatuses';
import { blogsCollection, postsCollection } from '../../../db/db';
import { Router, Request, Response } from "express";

export const testingRouter = Router();

// Deleting of all data from DB
testingRouter.delete('/all-data', async (_req: Request, res: Response) => {
    try {
      await blogsCollection.deleteMany({});
      await postsCollection.deleteMany({});
  
      res
        .status(HttpStatus.NoContent)
        .send('All data is deleted');
    } catch (error) {
      console.error("Error clearing test DB:", error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
});
