import { Resolutions } from "./constants";
import { TOutputCreateVideoError, TVideoDB } from "./types";

export const createVideoValidation = (video: TVideoDB) => {
    const errors: TOutputCreateVideoError = {
        errorsMessages: []
    }

    if (!Array.isArray(video.availableResolutions)
        || video.availableResolutions.find(resolution => !Resolutions[resolution])
    ) {
        errors.errorsMessages.push({
            message: 'error', 
            field: 'availableResolutions'
        })
    }

    if(video.minAgeRestriction && (video.minAgeRestriction < 1 || video.minAgeRestriction > 18)) {
        errors.errorsMessages.push({
            message: 'error', 
            field: 'minAgeRestriction'
        })
    }

    if(!video.title || !video.author) {
        errors.errorsMessages.push({
            message: 'error', 
            field: 'Fields title and author are required'
        })
    }

    return errors;
}

export const getNextDayInISOString = (curISODate: string) => {
    const date = new Date(curISODate);

    date.setDate(date.getDate() + 1);

    return date.toISOString();
}