const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');//import my mongoose instance
const Job = require('./models/Job');

//connect with my mongodb:
// mongoose.connect('mongodb://localhost:27017/jobBoardDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log('Connect Succesfully!'));

const URL = 'https://www.haooffer.net/jobs?pageId=33&infoId=3013';
const urls = [
    'https://www.haooffer.net/jobs?pageId=33&infoId=3013',
    'https://www.haooffer.net/jobs?pageId=31&infoId=3011',
    'https://www.haooffer.net/jobs?pageId=41&infoId=4011',
    'https://www.haooffer.net/jobs?pageId=42&infoId=4012',
    'https://www.haooffer.net/jobs?pageId=52&infoId=5012'
];

async function fetchJobListings(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});

    await page.waitForSelector('.ant-table-row');//wait html class ant-table-row loading
    console.log('Page Loaded', url);

    const data = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.ant-table-row'));
        return rows.map(row => {
          const jobLink = row.querySelector('td:nth-child(1) a')?.getAttribute('href');
          const jobTitle = row.querySelector('td:nth-child(1) span')?.innerText.trim();
          const company = row.querySelector('td:nth-child(2) div')?.innerText.trim();
          const postTime = row.querySelector('td:nth-child(3)')?.innerText.trim();
          const location = row.querySelector('td:nth-child(4)')?.innerText.trim();
          const role = row.querySelector('td:nth-child(5)')?.innerText.trim();
          const type = row.querySelector('td:nth-child(6)')?.innerText.trim();
  
          return { jobTitle, company, postTime,  role, type, jobLink, location };
        });
    });

    // console.log(data);
    for(const jobData of data){
        const existingJob = await Job.findOne({url: jobData.jobLink});
        if(!existingJob){
            // newMaxId++;
            const mongodbNewJobs = new Job({
                // _id: newMaxId,
                jobTitle: jobData.jobTitle,
                company: jobData.company,
                postTime: jobData.postTime,
                role: jobData.role,
                type: jobData.type,
                url: jobData.jobLink,
                location: jobData.location
            });
            await mongodbNewJobs.save();
        }
    }

    //deal with the paging component
    // let hasNextPage = true;

    // while(hasNextPage){
    //     // console.log(`Navigating to the page: ${pageCount} +1`);
    //     await page.waitForSelector('.ant-table-row');//wait html class ant-table-row loading
    //     console.log('Page Loaded');

    //     const data = await page.evaluate(() => {
    //         const rows = Array.from(document.querySelectorAll('.ant-table-row'));
    //         return rows.map(row => {
    //           const jobLink = row.querySelector('td:nth-child(1) a')?.getAttribute('href');
    //           const jobTitle = row.querySelector('td:nth-child(1) span')?.innerText.trim();
    //           const company = row.querySelector('td:nth-child(2) div')?.innerText.trim();
    //           const postTime = row.querySelector('td:nth-child(3)')?.innerText.trim();
    //           const location = row.querySelector('td:nth-child(4)')?.innerText.trim();
    //           const role = row.querySelector('td:nth-child(5)')?.innerText.trim();
    //           const type = row.querySelector('td:nth-child(6)')?.innerText.trim();
      
    //           return { jobTitle, company, postTime,  role, type, jobLink, location };
    //         });
    //     });

    //     //get my customed _id
    //     // const maxCurrentId = await Job.findOne().sort('-_id').exec();
    //     // console.log(maxCurrentId);
    //     // let newMaxId = maxCurrentId._id;

    //     // console.log(data);
    //     for(const jobData of data){
    //         const existingJob = await Job.findOne({url: jobData.jobLink});
    //         if(!existingJob){
    //             // newMaxId++;
    //             const mongodbNewJobs = new Job({
    //                 // _id: newMaxId,
    //                 jobTitle: jobData.jobTitle,
    //                 company: jobData.company,
    //                 postTime: jobData.postTime,
    //                 role: jobData.role,
    //                 type: jobData.type,
    //                 url: jobData.jobLink,
    //                 location: jobData.location
    //             });
    //             await mongodbNewJobs.save();
    //         }
    //     }

    //     // console.log(`Page ${pageCount} +1 processed`);

    //     hasNextPage = await page.evaluate(()=>{
    //         const nextButton = document.querySelector('.ant-pagination-next');
    //         return nextButton && !nextButton.classList.contains('ant-pagination-disabled');
    //     });


    //     if(hasNextPage){
    //         // console.log('在pageCount循环里了: ${pageCount}+1');
    //         await Promise.all([
    //             page.waitForNavigation({ waitUntil: 'networkidle0' }),
    //             page.click('.ant-pagination-next'),
    //             // nextPageButton.click()
    //         ]);
    //     }else{
    //         break;
    //     }
    // }

    console.log('Data crawled, new crawled data saved succesfully');
    await browser.close();
    // await mongoose.disconnect();
    // console.log('MongoDB Disconnect');
  } catch (error) {
    console.error(`Error fetching job listings: ${error.message}`);
  }
}

async function main(){
    await mongoose.connect('mongodb://localhost:27017/jobBoardDB');
    console.log('Connected Successfully to MongoDB');

    for (const url of urls) {
        await fetchJobListings(url);
    }
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
}

main().catch(console.error);
