const express = require('express');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

// Middleware to attach the JWT token to the request object
app.use((req, res, next) => {
  req.jwtToken = process.env.API_WEBTOKEN;
  next();
});

// Define the /calls route
app.get('/calls', async (req, res) => {
  try {
    const authToken = req.jwtToken;

    const response = await axios.get('https://api.telavox.se/calls', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error making API request:', error.message);
    res.status(500).json({ error: 'An error occurred while making the API request' });
  }
});

app.get('/start-call/:number', async (req, res) => {
  try {
    const number = req.params.number;

    // Make a request to start the call using the extracted number
    const response = await axios.get(`https://api.telavox.se/dial/${number}`, {
      headers: {
        Authorization: `Bearer ${req.jwtToken}`,
      },
    });

    // Check the response from the VoIP service's API
    if (response.data.message === 'OK') {
      res.json({ message: response.data.message });
    } else {
      // Call initiation failed
      res.status(500).json({ error: 'Failed to initiate the call' });
    }
  } catch (error) {
    console.error('Error starting call:', error.message);
    res.status(500).json({ error: 'An error occurred while starting the call' });
  }
});

// Define the /hangup route
app.post('/hangup', async (req, res) => {
  try {
    const response = await axios.post('https://api.telavox.se/hangup', null, {
      headers: {
        Authorization: `Bearer ${req.jwtToken}`,
        'Content-Type': 'application/json'
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error hanging up call:', error.message);
    res.status(500).json({ error: 'An error occurred while hanging up the call' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
