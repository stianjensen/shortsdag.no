const express = require('express');
const apiServer = require('./api/router');

const app = express();
app.use('/api', apiServer);
app.use(express.static('.'));

app.listen(8999, function() {
  console.log('Started listening on port 8999');
});
