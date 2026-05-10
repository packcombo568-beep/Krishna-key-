const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

const Key = mongoose.model('Key', new mongoose.Schema({
    keyString: String,
    date: { type: Date, default: Date.now }
}));

app.get('/api/keys', async (req, res) => {
    const keys = await Key.find().sort({ date: -1 });
    res.json(keys);
});

app.post('/api/generate', async (req, res) => {
    const newKey = new Key({
        keyString: "KRN-" + crypto.randomBytes(3).toString('hex').toUpperCase()
    });
    await newKey.save();
    res.json(newKey);
});

app.delete('/api/delete/:id', async (req, res) => {
    await Key.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = app;

