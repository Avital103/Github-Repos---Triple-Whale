const request = require('request');
const express = require("express");

let router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        // Fetch the list of repositories
        const data = await getRepositories(process.env.TOKEN);

        // Sort the repositories by name
        const sortedRepositories = data.sort((a, b) => a.name.localeCompare(b.name));
        const repoNames = sortedRepositories.map(repo => repo.name);

        // Print the repositories' names
        console.log('Repository names:');
        console.log(repoNames.join('\n'));

        // Group the repositories by owner (login) and compute the number of repos per owner
        const groupedRepos = {};
        for (const repo of data) {
            const owner = repo.owner.login;
            groupedRepos[owner] = (groupedRepos[owner] || 0) + 1;
        }

        // Print the owners and the number of their repos
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

async function getRepositories(token) {
    const url = 'https://api.github.com/repositories';
    let page = 1;
    let allData = [];
    while (true) {
        const options = {
            url: `${url}?since=${page}`,
            headers: {
                'User-Agent': 'request',
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await new Promise((resolve, reject) => {
            request.get(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else if (response.statusCode !== 200) {
                    reject(new Error(`HTTP error status: ${response.statusCode}, Body: ${body}`));
                } else {
                    resolve(response);
                }
            });
        });

        const data = JSON.parse(response.body);
        allData = allData.concat(data);
        if (response.headers['x-ratelimit-remaining'] === 0) {
            console.log('Rate limit exceeded');
            break;
        }
        page++;
    }
    return allData;
}


module.exports = router;
