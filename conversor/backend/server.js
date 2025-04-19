const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API key for Open Exchange Rates
const API_KEY = process.env.OPENEXCHANGERATES_API_KEY;

// Route to get exchange rates
app.get('/api/convertir', async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    
    if (!from || !to || !amount) {
      return res.status(400).json({ 
        error: 'Se requieren los parámetros from, to y amount' 
      });
    }

    // Get latest exchange rates
    const response = await axios.get(
      `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=USD`
    );

    const rates = response.data.rates;
    
    // Calculate conversion
    // First convert to USD if source is not USD
    let convertedAmount;
    if (from === 'USD') {
      convertedAmount = amount * rates[to];
    } else {
      // Convert from source currency to USD then to target currency
      const sourceRate = rates[from];
      const targetRate = rates[to];
      convertedAmount = (amount / sourceRate) * targetRate;
    }

    return res.json({
      from,
      to,
      amount: parseFloat(amount),
      result: convertedAmount,
      rate: from === 'USD' ? rates[to] : rates[to] / rates[from]
    });
  } catch (error) {
    console.error('Error en la conversión:', error);
    res.status(500).json({ error: 'Error al obtener tasas de cambio' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
}); 