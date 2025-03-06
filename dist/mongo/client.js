"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesCollection = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const client = new mongodb_1.MongoClient(process.env.MONGODB_CONNECTION_STRING ?? '', {
    retryWrites: true,
    ignoreUndefined: true
});
client.connect().catch(console.error);
const database = client.db('livechat');
exports.messagesCollection = database.collection('messages');
