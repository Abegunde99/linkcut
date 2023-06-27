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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model('Url', UrlSchema);