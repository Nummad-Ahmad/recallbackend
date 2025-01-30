const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    name: String,
    url: String,
    date: String,
    status: String
});


const pdfModel = mongoose.model("pdf", pdfSchema);


module.exports = pdfModel;