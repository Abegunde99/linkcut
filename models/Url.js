const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'Please enter your url'],
        unique: true,
        match: [
            /^(ftp|http|https):\/\/[^ "]+$/,
            'Please add a valid url'
        ]
    },
    urlCode: {
        type: String,
    },
    qrCode: {
        type: String,
    },
});

module.exports = mongoose.model('Url', UrlSchema);