const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

const ArtistsRoute = require('./routes/Artists');
const AuthRoute = require('./routes/auth');
const SongRoute = require('./routes/Songs');
const UserRoutes = require('./routes/Users');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/api', ArtistsRoute);
app.use('/api', AuthRoute);
app.use('/api', SongRoute);
app.use('/api', UserRoutes);

module.exports = app;
