import { Request, Response } from "express";
import { Db, MongoClient } from "mongodb";

export type MyContext = {
    db: Db,
    dbClient: MongoClient,
    req: Request,
    res: Response
}