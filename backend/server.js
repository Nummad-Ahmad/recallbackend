import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config();
const app = express();
const port = 3000;

const corsOptions = {
    origin: process.env.frontendurl,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get('/', (req, res)=>{
    res.send('Hello');
})

app.listen(port, ()=>{
    console.log('SERcer started');
})