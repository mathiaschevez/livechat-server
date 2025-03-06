"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const messages_1 = require("./messages");
const cors_1 = __importDefault(require("cors"));
exports.app = (0, express_1.default)();
// Enable CORS for all requests
exports.app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
exports.app.use(express_1.default.json());
exports.app.use('/messages', messages_1.messagesRouter);
