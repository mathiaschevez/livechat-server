"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = void 0;
const express_1 = require("express");
const client_1 = require("../../mongo/client");
exports.messagesRouter = (0, express_1.Router)();
exports.messagesRouter.post('/', async (req, res) => {
    const messages = await client_1.messagesCollection
        .find()
        .toArray();
    res.json(messages);
});
exports.messagesRouter.post('/insert', async (req, res) => {
    const message = req.body.message;
    client_1.messagesCollection.insertOne({ message });
});
