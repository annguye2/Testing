const express = require('express');
const app = express();

app.use(express.static('public'));


const port = process.env.PORT || 8000



app.listen(port,() =>{
  console.log('=================================================');
  console.log('Geospatial Online App frontend server runs on this port:', port);
  console.log('=================================================');
});
