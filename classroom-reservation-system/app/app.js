
const express = require('express'); 
const cors = require('cors');

const app = express(); 

// Rotas
const userRoutes = require('../routes/userRoutes');
const roomRoutes = require('../routes/roomRoutes');
const bookingRoutes = require('../routes/bookingRoutes');

app.use(cors());
app.use(express.json()); // Habilita parsing de JSON

// ✅ Definir rotas
app.use('/api/users', userRoutes); 
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;
