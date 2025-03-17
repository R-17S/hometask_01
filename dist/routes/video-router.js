"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouter = exports.dbVideos = void 0;
const express_1 = require("express");
exports.dbVideos = [
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
exports.videoRouter = (0, express_1.Router)({});
// Роут для главной страницы
exports.videoRouter.get('/', (req, res) => {
    res.status(200).json(exports.dbVideos);
});
exports.videoRouter.get('/:id', (req, res) => {
    const foundVideo = exports.dbVideos.find((video) => video.id === +req.params.id);
    if (!foundVideo) {
        res.status(404).json({ message: 'Video not found' });
        return;
    }
    res.status(200).json(foundVideo);
});
exports.videoRouter.post('/', (req, res) => {
    const { title, author, availableResolutions } = req.body;
    // Валидация
    if (!title || typeof title !== "string" || title.trim().length > 40) {
        res.status(400).json({
            errorsMessages: [{ message: 'Title is required and should be less than 40 characters', field: 'title' }]
        });
        return;
    }
    if (!author || typeof author !== "string" || author.trim().length > 20) {
        res.status(400).json({
            errorsMessages: [{ message: 'Author is required and should be less than 20 characters', field: 'author' }]
        });
        return;
    }
    const validResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
    if (!validResolutions || !Array.isArray(validResolutions) || validResolutions.length === 0) {
        res.status(400).json({
            errorsMessages: [
                { message: 'At least one resolution should be added', field: 'availableResolutions' }
            ]
        });
        return;
    }
    for (let resolution of availableResolutions) {
        if (!validResolutions.includes(resolution)) {
            res.status(400).json({ message: `Invalid resolution: ${resolution}` });
            return;
        }
    }
    const newVideo = {
        id: exports.dbVideos.length + 1,
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        availableResolutions,
    };
    exports.dbVideos.push(newVideo);
    res.status(201).json(newVideo);
});
exports.videoRouter.put('/:id', (req, res) => {
    const { title, author, canBeDownloaded, minAgeRestriction, publicationDate, availableResolutions } = req.body;
    const foundVideo = exports.dbVideos.find((video) => video.id === +req.params.id);
    if (!foundVideo) {
        res.status(404).json({ message: 'Video not found' });
        return;
    }
    // Опять куча валидаций
    if (!title || typeof title !== 'string' || title.trim().length > 40) {
        res.status(400).json({
            errorsMessages: [{ message: 'Title is required and should be less than 40 characters', field: 'title' }]
        });
        return;
    }
    if (!author || typeof author !== 'string' || author.trim().length > 20) {
        res.status(400).json({
            errorsMessages: [{ message: 'Author is required and should be less than 40 characters', field: 'author' }]
        });
        return;
    }
    const validResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
    if (!availableResolutions || !Array.isArray(availableResolutions) || availableResolutions.length === 0) {
        res.status(400).json({
            errorsMessages: [
                { message: 'At least one resolution should be added', field: 'availableResolutions' }
            ]
        });
        return;
    }
    for (const resolution of availableResolutions) {
        if (!validResolutions.includes(resolution)) {
            res.status(400).json({ message: `Invalid resolution: ${resolution}` });
            return;
        }
    }
    if (typeof canBeDownloaded !== "boolean") {
        res.status(400).json({
            errorsMessages: [
                { message: 'canBeDownloaded must be a boolean', field: 'canBeDownloaded' }
            ]
        });
        return;
    }
    if (minAgeRestriction !== null && (typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18)) {
        res.status(400).json({
            errorsMessages: [
                { message: 'minAgeRestriction must be between 1 and 18 or null', field: 'minAgeRestriction' }
            ]
        });
        return;
    }
    if (!publicationDate || typeof publicationDate) {
        res.status(400).json({
            errorsMessages: [
                { message: 'publicationDate must be a valid date string', field: 'publicationDate' }
            ]
        });
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
exports.videoRouter.delete('/:id', (req, res) => {
    const videoIndex = exports.dbVideos.findIndex(v => v.id === +req.params.id);
    if (videoIndex === -1) {
        res.status(404).json({ message: 'Video not found' });
        return;
    }
    exports.dbVideos.splice(videoIndex, 1);
    res.status(204).send();
});
