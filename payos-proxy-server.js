const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PAYOS_API_URL = 'https://api.payos.vn/v1/payment-requests';
const CLIENT_ID = 'dadda435-f8c9-405a-a244-609315039ab5';
const API_KEY = 'cdee29cf-bbaf-4bc0-b820-6fd1229b209c';

app.post('/api/payos', async (req, res) => {
  try {
    console.log('--- PayOS API Called ---');
    console.log('Request body:', req.body);
    const payload = req.body;
    const response = await axios.post(PAYOS_API_URL, payload, {
      headers: {
        'x-client-id': CLIENT_ID,
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    console.log('PayOS response:', response.data);
    res.json({ checkoutUrl: response.data.data.checkoutUrl });
  } catch (err) {
    console.error('PayOS ERROR:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(5000, () => console.log('Backend PayOS proxy running on port 5000')); 