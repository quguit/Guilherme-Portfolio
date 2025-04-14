
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    type:{
        type: String,
        enum: ['classroom', 'laboratory', 'office'],
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    resources: {
        type: [String], 
        default: []
    },
    status_clean: {
        type: String,
        enum: ['clean', 'dirty', 'cleaning'],
        default: 'limpo'
    },
    observations: {
        type: String,
        default: ''
    },
    responsibles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);