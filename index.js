let fetch = require('node-fetch');
let query = require('./query');
let save = require('./saveSearchResults');
let config = require('./config.json');

const url = 'https://api.github.com/graphql'; // GitHub GraphQL API URL
const numResults = 10; // Number of results to return per search request
let searchResults = []; // Stores results
let requestCounter = 0; // Keeps track of the number of pages accessed

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
          process.stdout.write(`Retrieved ${res.data.search.userCount} users\r\n`);

          if (config.file_type == "csv") {
            // save to csv file
            save.csv(searchResults, searchQuery)
          } else {
            // save to json file
            save.json(searchResults, searchQuery)
          }
        }
      });
  })
}

process.stdout.write(`Searching for ${searchQuery}\n`);

makeRequest();
