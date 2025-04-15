require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Conectar ao MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Habilita parsing de JSON

// ✅ Rotas
app.use('/api/users', require('./routes/userRoutes')); // plural por convenção RESTful

// ✅ Iniciar servidor
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
