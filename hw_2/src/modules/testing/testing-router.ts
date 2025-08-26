import { Router, Request, Response } from "express";
import { getBlogsCollection, getPostsCollection } from "../../db/db";

export const testingRouter = Router();

// Deleting of all data from DB
testingRouter.delete('/all-data', async (_req: Request, res: Response) => {
    try {
      await getBlogsCollection().deleteMany({});
      await getPostsCollection().deleteMany({});
  
      res
        .status(204)
        .send('All data is deleted');
    } catch (error) {
      console.error("Error clearing test DB:", error);
      res.sendStatus(500);
    }
});
