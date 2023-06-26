const mongoose = require('mongoose');

const ClicksSchema = new mongoose.Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Url',
        required: true,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    devices: {
        type: Object,
        default: {},
    },
    locations: {
        type: Object,
        default: {},
    },
    sources: {
        type: Object,
        default: {},
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Clicks', ClicksSchema);