
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../../models/User');
const Room = require('../../models/Room');
const bcrypt = require('bcrypt');
const { status } = require('express/lib/response');
const res = require('express/lib/response');

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🟢 Conectado ao MongoDB');

        // Limpar o banco de dados
        await User.deleteMany({});
        await Room.deleteMany({});
        console.log('🔴 Banco de dados limpo');

        // Criar usuários
        const passwordHash = await bcrypt.hash('123456', 10);

        const teacher = await User.create({
            name: 'Prof. Fulano',
            email: 'fulano@ufrb.edu.br',
            password_hash: passwordHash,
            type_user: 'teacher',
            identification: '9876543',
        });

        const aluno = await User.create({
            name: 'Aluno Cicrano',
            email: 'cicrano@ufrb.edu.br',
            password_hash: passwordHash,
            type_user: 'student',
            identification: '2023012123',
        });

        // Criar sala com professor responsavel
        Room.create({
            number: 'LAB-101',
            type: 'laboratory',
            capacity: 30,
            resources: ['projetor', 'climatização'],
            status_clean: 'clean',
            observations: '',
            responsibles: [teacher._id],
        });

        console.log('🟢 Banco populado com sucesso');
        process.exit(0); // 0 ou vazio

    } catch (error) {
        console.error('🔴 Erro ao popular o banco:', error);
        process.exit(1);
    }
}

seedDatabase();