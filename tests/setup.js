jest.setTimeout(30000);
require('../models/User');//So that mongoose will now there is any UserSchema ;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const dbUrl = keys.mongoURI;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));//This file will run every time So there is no need to connect with mongodb further
db.once('open',function(){});