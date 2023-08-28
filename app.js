const axios = require('axios');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.get('/calls', async (req, res) => {
  try {
    const authToken = process.env.API_WEBTOKEN


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
