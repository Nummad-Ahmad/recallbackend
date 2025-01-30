const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    email: String,
    password: String,
    date: Date,
    endTime: Date,
    type: String
});
const pdfSchema = new mongoose.Schema({
    name: String,
    url: String,
    date: Date,
    status: String
});

const userModel = mongoose.model("users", userSchema);
const pdfModel = mongoose.model("pdf", pdfSchema);

module.exports = {userModel, pdfModel};