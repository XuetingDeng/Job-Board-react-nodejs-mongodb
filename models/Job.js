//Define the Mongoose model corresponding to the jobs collection in MongoDB
const mongoose = require('mongoose');

const josSchema = new mongoose.Schema({
    jobTitle: String,
    company: String,
    postTime: String,
    role: String,
    type: String,
    url: String,
    location: String,
    details: String
});

const Job = mongoose.model('Job', josSchema);

module.exports = Job;