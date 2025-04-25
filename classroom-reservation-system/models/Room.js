
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type:{
        type: String,
        enum: ['classroom', 'laboratory'],
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: [1, 'A sala deve ter pelo menos 1 lugar'],
        max: [100, 'A sala não pode ter mais de 100 lugares']
    },
    resources: {
        type: [String], 
        default: []
    },
    status_clean: {
        type: String,
        enum: ['clean', 'dirty', 'cleaning'],
        default: 'clean'
    },
    observations: {
        type: String,
        default: '',
        trim: true
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