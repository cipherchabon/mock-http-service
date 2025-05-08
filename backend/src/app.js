// app.js - Archivo principal
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Servir la interfaz de administración
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor mock ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;



