//Create nodejs routes to get data from jobBoardDB.jobs
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { exec } = require('child_process');

//get job lists and sort descending by post date:
router.get('/jobs', async (req, res) => {
    try{
        const jobs = await Job.find();//use Mongoose 查data
        //sorting
        jobs.sort((o1, o2) => {
            const dataO1 = new Date(o1.postTime);
            const dataO2 = new Date(o2.postTime);
            return dataO2 - dataO1;
        });
        res.json(jobs);
    } catch(error){
        res.status(500).json({message: error.message});
    }
});

router.get('/fetch-jobs',(req, res) => {
    exec('node crawler.js', (error,stdout,stderr) => {
        if(error){
            console.error(`some error: ${error}`);
            return res.status(500).send('Crawler execution failed');
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('Crawler Executed Successfully');
    });
});

module.exports = router;