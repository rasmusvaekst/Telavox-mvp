const axios = require('axios');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  req.jwtToken = process.env.API_WEBTOKEN;
  next();
});


  app.get('/calls', async (req, res) => {
    try {
      const authToken = process.env.API_WEBTOKEN;
  
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

  
  // Endpoint to start a call
app.get('/start-call/:number', async (req, res) => {
  try {
    const number = req.params.number;
    const autoanswer = true;

    const response = await axios.get(`https://api.telavox.se/dial/${number}`, {
      headers: {
        Authorization: `Bearer ${req.jwtToken}`
      },
      params: {
        autoanswer: autoanswer
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error starting call:', error.message);
    res.status(500).json({ error: 'An error occurred while starting the call' });
  }
});

app.post('/hangup', async (req, res) => {
  try {
    const response = await axios.post('https://api.telavox.se/hangup', null, {
      headers: {
        Authorization: `Bearer ${req.jwtToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error hanging up call:', error.message);
    res.status(500).json({ error: 'An error occurred while hanging up the call' });
  }
});


app.get('/send-sms/:number', async (req, res) => {
  try {
    const number = req.params.number;
    const message = 'Hello, this is a test SMS!';

    const response = await axios.post(`https://api.telavox.se/sms/${number}`, {
      message: message
    }, {
      headers: {
        Authorization: `Bearer ${req.jwtToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    res.status(500).json({ error: 'An error occurred while sending the SMS' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
