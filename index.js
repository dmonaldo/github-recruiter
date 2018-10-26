let fetch = require('node-fetch');
let query = require('./query');
let save = require('./saveSearchResults');
let config = require('./config.json');

const url = 'https://api.github.com/graphql'; // GitHub GraphQL API URL
let searchResults = []; // Stores results
let requestCounter = 0; // Keeps track of the number of pages accessed

// Number of results to return per search request
const numResults = config.users_per_search ? config.users_per_search : 10;

// Get searchQuery from command line arguments
try {
  if (process.argv[2])
    var searchQuery = process.argv[2];
  else
    throw new Error("Missing search query argument");
} catch(err) {
  console.log(err)
  return;
}

let makeRequest = function(endCursor) {
  return new Promise(function(resolve, reject) {
    requestCounter++;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${config.github_auth_token}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          searchQuery,
          numResults,
          endCursor
        }
      })
    })
      .then(r => r.json())
      .then(res => {
        searchResults.push(...res.data.search.edges)

        if (res.data.search.pageInfo.hasNextPage) {
          process.stdout.write(`Retrieved ${requestCounter * numResults}/${res.data.search.userCount} users\r`);
          makeRequest(res.data.search.pageInfo.endCursor)
        } else {
          resolve();
          process.stdout.clearLine();

          if (res.data.search.userCount > 0) {
            process.stdout.write(`Retrieved ${res.data.search.userCount} users\r\n`);

            if (config.file_type == "csv") {
              // save to csv file
              save.csv(searchResults, searchQuery)
            } else if (config.file_type == "json") {
              // save to json file
              save.json(searchResults, searchQuery)
            }
          } else {
            process.stdout.write(`No users that matched your search query were found.\r\n`);
          }
        }
      });
  })
}

process.stdout.write(`Searching for ${searchQuery}\n`);

makeRequest();
