import express, {Request, Response} from 'express';
import {dbVideos, videoRouter} from "./routes/video-router";

export const app = express();
const port = 3000;

// Middleware для обработки JSON
app.use(express.json());
// ngrok / serveo / localhost:run /
// node dist/index.js -> tsc -w && node dist/index.js

export type AvailableResolutions = "P144" | "P240" | "P360" | "P480" | "P720" | "P1080" | "P1440" | "P2160";
export type Video = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: AvailableResolutions[];
};

export type CreateVideoInputModel = {
    title: string;
    author: string;
    availableResolutions: AvailableResolutions[];
};


 export type UpdateVideoInputModel = {
    title: string;
    author: string;
    availableResolutions: AvailableResolutions[];
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    publicationDate: string;
};

app.use('/videos', videoRouter);
app.delete('/testing/all-data', (req: Request, res: Response) => {
    dbVideos.length = 0;
    res.status(204).send();
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

