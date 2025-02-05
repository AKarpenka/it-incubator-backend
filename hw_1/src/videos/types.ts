import { Resolutions } from "./constants";

export type ResolutionsString = keyof typeof Resolutions;

export type TVideoDB = {
    id?: string;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    createdAt?: string;
    publicationDate?: string;
    availableResolutions?: Resolutions[];
}

export type TDataBase = {
    videos: TVideoDB[];
}

export type TErrorMessages = {
    message: string,
    field: string,
}

export type TOutputCreateVideoError = {
    errorsMessages: TErrorMessages[]
}