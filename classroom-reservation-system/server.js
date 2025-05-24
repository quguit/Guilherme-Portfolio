
require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');
const app = require('./app/app')
// Conectar ao MongoDB
connectDB();

//serve static files
app.use(ExpressValidator.static(path.join(__dirname, 'public')));

// redirecionar para o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 2032;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

