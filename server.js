//importiamo le librerie
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import cooksCandadatesRoute from "./routes/cooksCandidatesRoute.js";
import usersRoute from "./routes/usersRoute.js";
import cooksRoute from "./routes/cooksRoute.js";
import menusRoute from "./routes/menusRoute.js";
import filesUploadRoute from "./routes/filesUploadRoute.js";
import loginRoute from "./routes/loginRoute.js";
import createNewTokenRoute from "./routes/createNewTokenRoute.js";
import sendMailsRoute from "./routes/sendEmailsRoute.js";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5050;

const server = express();

server.use('/uploads/resumes', express.static(path.join(__dirname, './uploads/resumes')));
server.use('/uploads/avatars', express.static(path.join(__dirname, './uploads/avatars')));
server.use('/uploads/covers', express.static(path.join(__dirname, './uploads/covers')));
server.use('/uploads/coursesImages', express.static(path.join(__dirname, './uploads/coursesImages')));
server.use(express.json());
server.use(cors());

server.use('/', cooksCandadatesRoute);
server.use('/', usersRoute);
server.use('/', cooksRoute);
server.use('/', menusRoute);
server.use('/', filesUploadRoute);
server.use('/', loginRoute);
server.use('/', createNewTokenRoute);
server.use('/', sendMailsRoute);

//metodo di connessione al DB
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//salviamo la connessione al DB in una variabile
const db = mongoose.connection;

//definizione dei listener relativi al DB
db.on('error', console.error.bind(console, 'DB connection error')); //listener degli errori
db.once('open', ()=>{console.log('DB connected')}); //listener della connessione al DB

server.listen(PORT, () => console.log('Server running'));