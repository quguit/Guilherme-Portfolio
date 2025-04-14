
const mongoose = require('mongoose');
const Booking = require('./Booking');

const authorizationSchema = new mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    authorized_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //teacher's
        required: true
    },
    status: {
        type: String,
        enum: ['approved', 'rejected'],
        default: 'approved'
    },
    date_authorization: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Authorization', authorizationSchema);