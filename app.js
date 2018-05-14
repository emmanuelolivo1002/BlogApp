const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var app = express();




app.listen(process.env.PORT || 3000, function() {
  console.log("Listening to server");
});
