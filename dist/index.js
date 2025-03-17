"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const video_router_1 = require("./routes/video-router");
exports.app = (0, express_1.default)();
const port = 3000;
// Middleware для обработки JSON
exports.app.use(express_1.default.json());
exports.app.use('/videos', video_router_1.videoRouter);
exports.app.delete('/testing/all-data', (req, res) => {
    video_router_1.dbVideos.length = 0;
    res.status(204).send();
});
// Запуск сервера
exports.app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
