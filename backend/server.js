const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 3000;

const corsOptions = {
    origin: process.env.frontendUrl || 'https://recallchatbot.vercel.app',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get('/', (req, res)=>{
    res.send('Backend deployed successfully');
})

app.listen(port, ()=>{
    console.log('server started');
})