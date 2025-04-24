
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, type_user, identification } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            type_user,
            identification
        });

        res.status(201).json({user});
    } catch (err) {
        res.status(400).json({ erro: 'Erro ao registrar usuário', detalhes: err.message });    }
    
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // validate password 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                type_user: user.type_user 
            }, process.env.JWT_SECRET, { expiresIn: '1d' } );

        // Return user data and token
        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                type_user: user.type_user,
            }
        });

    } catch (err) {
        res.status(500).json({erro: 'Erro ao fazer login', details: err.message });
        
    }
};