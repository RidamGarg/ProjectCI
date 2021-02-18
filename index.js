const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

require('./models/User');
require('./models/Blog');
require('./services/passport');
require('./middlewares/cache');//Insert this file here as mongoose is connected here
const dbUrl = keys.mongoURI;
mongoose.Promise = global.Promise;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));//This file will run every time So there is no need to connect with mongodb further
db.once('open', function() {
console.log('we are connected!');
});

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
//eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjAxMzMxYzRkYmFiYjcyZWI4M2I3ZmY3In19
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

if (['production','ci'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(PORT)
  console.log(`Listening on port`, PORT);
});
