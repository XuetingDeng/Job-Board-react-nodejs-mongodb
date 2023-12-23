const express = require('express');
const app = express();
const jobRoutes = require('./routes/jobRoutes');

//solve CORS Policy (different port, front-end:3000 and nodejs:3001)
const cors = require('cors');
app.use(cors());

//set my route
app.use('/api', jobRoutes);

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/jobBoardDB');

mongoose.connection.on('connected', ()=> {
    console.log('Connected to MongoDB Sucessfully');
});

module.exports = mongoose;