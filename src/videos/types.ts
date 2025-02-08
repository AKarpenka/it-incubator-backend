import { TErrorMessage } from "../types";
import { Resolutions } from "./constants";

export type ResolutionsString = keyof typeof Resolutions;

export type TVideoDB = {
    id?: number;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    createdAt?: string;
    publicationDate?: string;
    availableResolutions?: Resolutions[];
}

export type TOutputCreateVideoError = {
    errorsMessages: TErrorMessage[]
}