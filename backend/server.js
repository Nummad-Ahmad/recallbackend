const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/'; 
// const mongoURI = 'mongodb+srv://nummad:12345@cluster0.ceymr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

dotenv.config();
const app = express();
const port = 3000;

const corsOptions = {
    // origin: process.env.frontendUrl || 'https://recallchatbot.vercel.app',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get('/', (req, res)=>{
    res.send('Backend deployed successfully');
})


mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));
app.listen(port, ()=>{
    console.log('server started');
})