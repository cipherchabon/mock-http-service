// app.js - Archivo principal
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor mock ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;



