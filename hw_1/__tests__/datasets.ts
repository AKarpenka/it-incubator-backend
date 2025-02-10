import {TDataBase} from '../src/types';
import { Resolutions } from '../src/videos/constants';
import { getNextDayInISOString } from '../src/videos/helpers';
import { TVideoDB } from '../src/videos/types';

export const newVideoWithIdMock: TVideoDB = {
    id: 1,
    title: 't',
    author: 'a',
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: getNextDayInISOString(new Date().toISOString()),
    availableResolutions: [Resolutions.P240],
}

export const dataSetMock: TDataBase = {
    videos: [newVideoWithIdMock],
}
