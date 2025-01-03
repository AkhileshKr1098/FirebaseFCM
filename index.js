const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config(); 

const PORT = process.env.PORT || 3000;
const FIREBASE_CREDENTIAL_PATH = process.env.FIREBASE_CREDENTIAL_PATH;

const serviceAccount = require('./servies.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
app.post('/send', async (req, res) => {
  const { token, title, body } = req.body;
console.log(req.body)
  if (!token || !title || !body) {
    return res.status(400).send({ message: 'Token, title, and body are required' });
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.send({ message: 'Notification sent successfully', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ message: 'Error sending notification', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
