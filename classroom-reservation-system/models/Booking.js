
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    status_booking: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    purpose: {
        type: String,
        default: ''
    },
    key_return: {
        type: Boolean,
        default: false
    },
    requested_teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // ou 'Teacher', se você tiver um model separado
        required: false
    },
      
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);