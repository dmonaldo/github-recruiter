let fetch = require('node-fetch');
let query = require('./query');
let save = require('./saveSearchResults');

const url = 'https://api.github.com/graphql';
const token = 'e0883dccaab41783d748b19907748811dc2c24f1';
const numResults = 10;

var searchQuery = 'location:"Buenos Aires" language:Javascript';
let searchResults = [];
let csv = true;
let json = true;
let requestCounter = 0;

// try {
//   if (process.argv[2])
//     var searchQuery = process.argv[2]
//   else
//     throw new Error("Missing search query argument");
// } catch(err) {
//   console.log(err)
//   return;
// }

let makeRequest = function(endCursor) {
  return new Promise(function(resolve, reject) {
    requestCounter++;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${token}`,
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
          process.stdout.write('\n');

          if (csv) {
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
