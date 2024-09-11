const request = require('request');
const express = require("express");

let router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        const data = await getRepositories();

        const sortedRepositories = data.sort((a, b) => a.name.localeCompare(b.name));
        const repoNames = sortedRepositories.map(repo => repo.name);

        console.log('Repository names:');
        console.log(repoNames.join('\n'));

        const groupedRepos = {};
        for (const repo of data) {
            const owner = repo.owner.login;
            groupedRepos[owner] = (groupedRepos[owner] || 0) + 1;
        }

        console.log('Owners and the number of their repos:');
        for (const [owner, count] of Object.entries(groupedRepos)) {
            console.log(`${owner}: ${count}`);
        }

        res.send('Success');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
});

async function getRepositories() {
    const url = 'https://api.github.com/repositories';
    let allData = [];
    const options = {
        url,
        headers: {
            'User-Agent': 'request',
        }
    };
    const response = await new Promise((resolve, reject) => {
        request.get(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else if (response.statusCode !== 200) {
                reject(new Error(`HTTP error status: ${response.statusCode}`));
            } else {
                resolve(response);
            }
        });
    });
    const data = JSON.parse(response.body);
    allData = allData.concat(data);

    return allData;
}


module.exports = router;
