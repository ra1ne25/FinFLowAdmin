// server.js
const express = require('express');
const cors = require('cors');
const db = require('./config/firebaseConfig'); // убедитесь, что путь корректный

const app = express();
app.use(cors());
app.use(express.json());

app.post('/add-story', async (req, res) => {
  const { item, urls } = req.body;

  try {
    const batch = db.batch();

    urls.forEach(url => {
      const docRef = db.collection('stories').doc();
      batch.set(docRef, { item, url });
    });

    await batch.commit();
    res.status(200).send({ message: 'Stories added successfully' });
  } catch (error) {
    console.error('Error adding stories:', error);
    res.status(500).send({ message: 'Error adding stories' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
