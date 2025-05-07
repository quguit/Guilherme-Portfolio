
const request = require(supertest);
const app = require('../../app/app');
const User = require('../../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// limpar o banco de dados após cada teste
beforeEach(async () => {
  await User.deleteMany({});
});

// desconectar do banco de dados após todos os testes
afterAll(async () => {
  await mongoose.connection.close();
});

