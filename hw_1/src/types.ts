import { TVideoDB } from "./videos/types";

export type TDataBase = {
    videos: TVideoDB[];
}

export type TErrorMessage = {
    message: string,
    field: string,
}