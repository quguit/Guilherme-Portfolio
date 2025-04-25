
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome não pode ser vazio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email não pode ser vazio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Por favor, insira um email válido']
    },
    password: {
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
    },
    reset_token: String,
    reset_token_expiry: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

// timestamps	Adiciona createdAt e updatedAt, 
// colocar	No segundo argumento do Schema

// trim	Remove espaços extras no início/fim do texto	
// usar Em campos String como nome, email, etc