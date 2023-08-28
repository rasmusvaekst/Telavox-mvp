const axios = require('axios');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const username = 'test';
const password = 'test';

async function getAuthToken() {
    try {
      const response = await axios.post('https://api.telavox.se/auth/token', {
        username: process.env.TELAVOX_USERNAME,
        password: process.env.TELAVOX_PASSWORD
      });
  
      return response.data.token;
    } catch (error) {
      throw new Error('Failed to obtain JWT token');
    }
  }

app.get('/calls', async (req, res) => {
  try {
    const authToken = await getAuthToken();


    const response = await axios.get('https://api.telavox.se/calls', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error making API request:', error.message);
    res.status(500).json({ error: 'An error occurred while making the API request' });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
