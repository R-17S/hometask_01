import {Request, Response,Router} from "express";
import {AvailableResolutions, CreateVideoInputModel, UpdateVideoInputModel, Video} from "../index";

export const dbVideos: Video[] = [
    {
        id: 1,
        title: "Introduction to TypeScript",
        author: "Alice",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: "2023-10-05T14:30:00.000Z",
        publicationDate: "2023-10-06T14:30:00.000Z",
        availableResolutions: ["P144", "P720"],
    },
    {
        id: 2,
        title: "Advanced JavaScript",
        author: "Bob",
        canBeDownloaded: true,
        minAgeRestriction: 16,
        createdAt: "2023-10-04T10:00:00.000Z",
        publicationDate: "2023-10-05T10:00:00.000Z",
        availableResolutions: ["P1080", "P2160"],
    },
];
export const videoRouter = Router({});



// Роут для главной страницы
videoRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json(dbVideos);
});
videoRouter.get('/:id', (req: Request, res: Response) => {
    const foundVideo = dbVideos.find((video) => video.id === +req.params.id);
    if (!foundVideo) {
        res.status(404).json({ message: 'Video not found' });
        return;
    }
    res.status(200).json(foundVideo);
});
videoRouter.post('/', (req: Request<{}, {}, CreateVideoInputModel>, res: Response) => {
    const {title, author, availableResolutions} = req.body;
    const errorsMessages: {message: string; field: string}[] = [];
// Валидация
    if (!title || title.trim().length > 40) {
        errorsMessages.push({
            message: 'Title is required and should be less than 40 characters', field: 'title'
        });
    }
    if (!author || author.trim().length > 20) {
        errorsMessages.push({
            message: 'Author is required and should be less than 20 characters', field: 'author'
        });
    }
    const validResolutions: AvailableResolutions[] = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
    if (!availableResolutions || !Array.isArray(availableResolutions)   || availableResolutions.length === 0 ) {
        errorsMessages.push({
                message: 'At least one resolution should be added', field: 'availableResolutions'
        });
    } else {
        for (let resolution of availableResolutions) {
            if (!validResolutions.includes(resolution)) {
                errorsMessages.push({message: `Invalid resolution: ${resolution}`, field: 'availableResolutions'});
                break;
            }
        }
    }
    if (errorsMessages.length > 0) {
        res.status(400).json({errorsMessages})
        return;
    }
    const newVideo: Video = {
        id: dbVideos.length + 1,
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        availableResolutions,
    }
    dbVideos.push(newVideo)
    res.status(201).json(newVideo);
});
videoRouter.put('/:id', (req: Request<{id: string}, {}, UpdateVideoInputModel>, res: Response) => {
    const {title, author, canBeDownloaded, minAgeRestriction, publicationDate, availableResolutions} = req.body;
    const foundVideo = dbVideos.find((video) => video.id === +req.params.id);
    if (!foundVideo) {
        res.status(404).json({ message: 'Video not found' });
        return;
    }
    const errorsMessages: {message: string; field: string}[] = [];
// Опять куча валидаций
    if (!title || title.trim().length > 40) {
        errorsMessages.push({
            message: 'Title is required and should be less than 40 characters', field: 'title'
        });
    }
    if (!author || author.trim().length > 20) {
        errorsMessages.push({
            message: 'Author is required and should be less than 20 characters', field: 'author'
        });
    }
    const validResolutions: AvailableResolutions[] = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
    if (!availableResolutions || !Array.isArray(availableResolutions) || availableResolutions.length === 0) {
        errorsMessages.push({
            message: 'At least one resolution should be added', field: 'availableResolutions'
        });
    }
    for (const resolution of availableResolutions) {
        if (!validResolutions.includes(resolution)) {
            errorsMessages.push({message: `Invalid resolution: ${resolution}`, field: 'availableResolutions'})
            break;
        }
    }
    if (canBeDownloaded === undefined) {
        errorsMessages.push({
            message: 'canBeDownloaded must be a boolean', field: 'canBeDownloaded'
        });
    }
    if (minAgeRestriction !== null && (minAgeRestriction < 1 || minAgeRestriction > 18)) {
        errorsMessages.push({
            message: 'minAgeRestriction must be between 1 and 18 or null', field: 'minAgeRestriction'
        });
    }
    if (!publicationDate || isNaN(Date.parse(publicationDate))) {
        errorsMessages.push({
            message: `publicationDate must be a valid date string^ ${publicationDate}`, field: 'publicationDate'
        });
    }
    if (errorsMessages.length > 0) {
        res.status(400).json({errorsMessages})
        return;
    }
    foundVideo.title = title;
    foundVideo.author = author;
    foundVideo.canBeDownloaded = canBeDownloaded;
    foundVideo.minAgeRestriction = minAgeRestriction;
    foundVideo.publicationDate = publicationDate;
    foundVideo.availableResolutions = availableResolutions;

    res.status(204).send();
});
videoRouter.delete('/:id', (req: Request, res: Response) => {
    const videoIndex = dbVideos.findIndex(v => v.id === +req.params.id);
    if (videoIndex === -1) {
        res.status(404).json({ message: 'Video not found' });
        return;
    }
    dbVideos.splice(videoIndex, 1);
    res.status(204).send();
});
