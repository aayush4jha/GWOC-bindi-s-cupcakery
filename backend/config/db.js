import mongoose from "mongoose";
import { connectGridFS } from './gridfsConfig.js';  // Note the .js extension

export const connectDB = async () => {
    const conn = await mongoose.connect('mongodb+srv://tarun02185:oT886qfJNfRebquW@cluster0.02kzr.mongodb.net/bindi');
    console.log("DB Connected");
    connectGridFS(conn.connection.db);
}