const express = require('express'),
app = express();

// set our port
const port = process.env.PORT || 3000;

app.use(express.static('dist',{redirect:false}));
app.use('/*', express.static('dist'))

app.listen(port, () => {
    console.log(`API Server started on port ${port}`);
  });