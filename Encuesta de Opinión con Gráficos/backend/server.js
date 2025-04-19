const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const surveyRoutes = require('./routes/survey');

// Cargar variables de entorno
dotenv.config();

// Inicializar express
const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/survey', surveyRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API running');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 