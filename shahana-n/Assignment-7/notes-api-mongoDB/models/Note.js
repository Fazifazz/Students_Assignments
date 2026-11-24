const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
    type: String,
    enum: {
        values: ['General', 'Work', 'Personal', 'Ideas'],
        message: '{VALUE} is not valid'
    },
    default: 'General'
  },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('note', noteSchema);