
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/mail');

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

exports.recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
    
        if (!email) return res.status(400).json({ error: 'E-mail é obrigatório.' });
    
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado com este e-mail.' });
    
        // Gerar token seguro
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_RESET_SECRET,
            { expiresIn: '1h' } 
        )
    
        user.reset_token = token;
        
        await user.save();
    
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    
        // Enviar e-mail
        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: user.email,
          subject: 'Recuperação de Senha',
          html: `<p>Olá, ${user.name},</p>
                 <p>Para redefinir sua senha, clique no link abaixo:</p>
                 <a href="${resetLink}">${resetLink}</a>
                 <p>O link é válido por 1 hora.</p>`
        });
    
        res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso.' });
    
      } catch (error) {
        res.status(500).json({ error: 'Erro ao enviar e-mail.', detalhes: error.message });
      }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, new_password, confirm_password } = req.body;
    
        if (!token || !new_password || !confirm_password) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        
        if (new_password !== confirm_password) {
            return res.status(400).json({ error: 'As senhas não coincidem.' });
        }
        // Verificar o token
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Criptografar a nova senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        // Atualizar a senha
        user.password = hashedPassword;
        user.reset_token = undefined; // Limpar o token
        user.reset_token_expiry = undefined; // Limpar a expiração do token
        await user.save();
       
        res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(400).json({ error: 'Token expirado. Solicite um novo link de redefinição.' });
        }
        if (error.name === 'JsonWebTokenError') {
          return res.status(400).json({ error: 'Token inválido ou corrompido.' });
        }
        res.status(500).json({ error: 'Erro ao redefinir a senha.', detalhes: error.message });
      }
};
//Test route Body(JSON)
/*{
  "token": "<cole o token JWT que recebeu por e-mail>",
  "new_password": "NovaSenhaSegura123!",
  "confirm_password": "NovaSenhaSegura123!"
}
  Content-Type: application/json
  */ 
