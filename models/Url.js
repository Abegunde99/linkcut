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
    slug: {
        type: String,
        unique: true,
    },
    urlCode: {
        type: String,
        unique: true,
    },
    qrCode: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Url', UrlSchema);