import { Resolutions } from "./constants";
import { TOutputCreateVideoError, TVideoDB } from "./types";

export const createOrUpdateVideoValidation = (video: TVideoDB) => {
    const errors: TOutputCreateVideoError = {
        errorsMessages: []
    }

    if (!Array.isArray(video.availableResolutions)
        || video.availableResolutions.find(resolution => !Resolutions[resolution])
    ) {
        errors.errorsMessages.push({
            message: 'error: availableResolutions is required', 
            field: 'availableResolutions'
        })
    }

    if(video.minAgeRestriction && (video.minAgeRestriction < 1 || video.minAgeRestriction > 18)) {
        errors.errorsMessages.push({
            message: 'error: should be 1 < minAgeRestriction > 18', 
            field: 'minAgeRestriction'
        })
    }

    if(!video.author) {
        errors.errorsMessages.push({
            message: 'error: author is required', 
            field: 'author'
        })
    }

    if(video.author && video.author.length > 20) {
        errors.errorsMessages.push({
            message: 'error: maxLength: 20', 
            field: 'author'
        })
    }

    if(!video.title) {
        errors.errorsMessages.push({
            message: 'error: title is required', 
            field: 'title'
        })
    }

    if(video.title && video.title.length > 40) {
        errors.errorsMessages.push({
            message: 'error: maxLength: 40', 
            field: 'title'
        })
    }

    if(video.canBeDownloaded && typeof video.canBeDownloaded === 'string') {
        errors.errorsMessages.push({
            message: 'canBeDownloaded should be boolean', 
            field: 'canBeDownloaded'
        })
    }

    if(video.publicationDate && typeof video.publicationDate !== 'string') {
        errors.errorsMessages.push({
            message: 'publicationDate should be ISO String', 
            field: 'publicationDate'
        })
    }

    return errors;
}

export const getNextDayInISOString = (curISODate: string) => {
    const date = new Date(curISODate);

    date.setDate(date.getDate() + 1);

    return date.toISOString();
}
