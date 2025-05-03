
require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app')

// Conectar ao MongoDB
connectDB();




// ✅ Iniciar servidor
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

