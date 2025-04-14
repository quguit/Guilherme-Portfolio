
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password_hash: {
        type: String,
        required: true
    },
    type_user: {
        type: String,
        enum: ['student', 'teacher', 'servant'],
        default: 'user'
    },
    identification: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

// timestamps	Adiciona createdAt e updatedAt, 
// colocar	No segundo argumento do Schema

// trim	Remove espaços extras no início/fim do texto	
// usar Em campos String como nome, email, etc