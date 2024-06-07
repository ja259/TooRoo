require('dotenv').config();
const app = require('./server');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const analyzePreferences = require('./analyzePreferences');
const recommendContent = require('./recommendContent');
const User = require('./models/User');
const Post = require('./models/Post');
const Interaction = require('./models/Interaction');
const Video = require('./models/Video');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:3000', 'https://ja259.github.io'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Rest of your routes and middleware...

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Exporting modules
module.exports = {
    recommendContent,
    analyzePreferences
};
