const express = require('express');
const router = require('./router');

var app = express();
app.use(router);
app.listen(8999, function() {
  console.log('Started listening on port 8999');
});
