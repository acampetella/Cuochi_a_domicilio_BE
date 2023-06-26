//importiamo le librerie
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import cooksCandadatesRoute from "./routes/cooksCandidatesRoute.js";
import usersRoute from "./routes/usersRoute.js";
import cooksRoute from "./routes/cooksRoute.js";
import menusRoute from "./routes/menusRoute.js";

dotenv.config();

const PORT = 5050;

const server = express();

server.use(express.json());
server.use(cors());

server.use('/', cooksCandadatesRoute);
server.use('/', usersRoute);
server.use('/', cooksRoute);
server.use('/', menusRoute);


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