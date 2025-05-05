
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const mongoose = require('mongoose'); // Importa o mongoose para conectar ao MongoDB
const connectDB = async () => {
  const uri = process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

  if (!uri) {
    console.error('🔴 A variável de conexão com o MongoDB não está definida.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`🟢 MongoDB conectado com sucesso! (${process.env.NODE_ENV || 'development'})`);
  } catch (error) {
    console.error('🔴 Erro ao conectar com MongoDB:', error.message);
    process.exit(1);
  }
};


module.exports = connectDB;
