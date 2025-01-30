const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userModel = require('./models/users');
const pdfModel = require('./models/pdfs');
// const mongoURI = 'mongodb://localhost:27017/users';
const bcrypt = require('bcrypt');
const mongoURI = 'mongodb+srv://nummad:12345@cluster0.ceymr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const multer = require('multer');
const cloudinary = require('./config');
const storage = multer.memoryStorage();
const upload = multer({ storage });

dotenv.config();
const app = express();
const port = 3000;

const corsOptions = {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend deployed successfully');
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ error: 'User not found. Please sign up first.' });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', user: existingUser });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.post('/upload', upload.single('pdf'), async (req, res) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-GB', options);
    try {
        const file = req.file;
        const filename = req.body.filename;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "pdf_uploads",
                    format: "pdf",
                    public_id: filename
                },
                (error, result) => (error ? reject(error) : resolve(result))
            );
            uploadStream.end(file.buffer);
        });
        const newPDF = new pdfModel({ url: result.secure_url, name: filename, date: currentDate, status: 'Active' });
        await newPDF.save();
        res.status(201).json({ message: "PDF uploaded successfully", url: result.secure_url, filename });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});



app.post('/signup', async (req, res) => {
    const currentTime = new Date();
    const futureTime = new Date(currentTime);
    futureTime.setDate(currentTime.getDate() + 7);
    const { email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ email, password: hashedPassword, type: 'trial', date: currentTime, endTime: futureTime });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});




mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB', err));

app.listen(port, () => {
    console.log('server started');
})