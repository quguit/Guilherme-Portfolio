const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../../../config/mail');

// ▶️ Registro de novo usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, type_user, identification } = req.body;

    if (!name || !email || !password || !confirmPassword || !type_user || !identification) {
      return res.status(400).json({ erros: [{ msg: 'Todos os campos são obrigatórios.' }] });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'As senhas não coincidem.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'E-mail já cadastrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      type_user,
      identification
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso.', user: { name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário.', detalhes: error.message });
  }
};

// ▶️ Login do usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login realizado com sucesso.', token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login.', detalhes: error.message });
  }
};

// ▶️ Enviar e-mail de recuperação de senha
exports.recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'E-mail é obrigatório.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });

    user.reset_token = token;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Recuperação de Senha',
      html: `
        <p>Olá, ${user.name},</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link é válido por 1 hora.</p>
      `
    });

    res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar e-mail.', detalhes: error.message });
  }
};

// ▶️ Resetar senha com token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'As senhas não coincidem.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.reset_token !== token) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.reset_token = null;
    await user.save();

    res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao redefinir senha.', detalhes: error.message });
  }
};

// ▶️ Rota protegida de exemplo
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil.', detalhes: error.message });
  }
};
