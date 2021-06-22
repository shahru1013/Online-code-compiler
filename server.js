const express = require('express');
const path = require('path');
const database = require('./Api/database');
const app = express();
const axios = require('axios');
const Formdata = require('form-data');
const cors = require('cors');
const port = process.env.PORT || 4000;
app.listen(port);
app.use(cors());
app.use('/api', database);
// handle frontend with nodejs
app.use(express.static('./client/build/'));
app.get('*', function(req, res) {
  res.sendFile('index.html',{ root: __dirname },function(err) {
    if (err) {
      res.status(500).send(err)
    }
  });
});

