const fs = require('fs');
const json2csv = require('json2csv').parse;

// Returns an object with all nested objects flattened as first children
let flattenJSON = (data) => {
  let result = {};
  let recurse = (cur, prop) => {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      cur.forEach(element => {
        recurse(element, prop);
      })
    } else {
      let isEmpty = true;
      for (let p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop+"."+p : p);
      }
      if (isEmpty && prop)
        result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

// Returns a string of names and descriptions for all repositories
let compileRepositories = (edges) => {
  let repositoryDump = "";
  edges.forEach(edge => {
    if (edge.node.description)
      repositoryDump += `${edge.node.name}: ${edge.node.description}\n`;
    else
      repositoryDump += `${edge.node.name}\n`;
  });
  return repositoryDump;
}

// Save search results as CSV file
module.exports.csv = (results, query) => {
  // Compile repositories into a single property
  results.map(element => {
    element.node.repositoriesDump = compileRepositories(element.node.repositories.edges);
    element.node.repositoriesContributedToDump = compileRepositories(element.node.repositoriesContributedTo.edges);
    return element;
  });

  // Results must be flattened objects in order to be stored as CSV
  let flattenedResults = [];
  results.forEach(element => {
    flattenedResults.push(flattenJSON(element))
  });

  // Field structure for CSV
  const fields = [{
    label: 'ID',
    value: 'node.id'
  },{
    label: 'Name',
    value: 'node.name'
  },{
    label: 'Email',
    value: 'node.email'
  },{
    label: 'URL',
    value: 'node.url'
  },{
    label: 'Bio',
    value: 'node.bio'
  },{
    label: 'Number of Repositories',
    value: 'node.repositories.totalCount'
  },{
    label: 'Repositories',
    value: 'node.repositoriesDump'
  },{
    label: 'Number of Repositories Contributed To',
    value: 'node.repositoriesContributedTo.totalCount'
  },{
    label: 'Repositories Contributed To',
    value: 'node.repositoriesContributedToDump'
  },{
    label: 'Followers',
    value: 'node.followers.totalCount'
  },{
    label: 'Following',
    value: 'node.following.totalCount'
  },{
    label: 'Pull Requests',
    value: 'node.pullRequests.totalCount'
  },{
    label: 'Hireable',
    value: 'node.isHireable'
  }];

  // Flatten JSON objects so it can be stored as CSV
  const csv = json2csv(flattenedResults, { fields });

  // Build file name
  let now = new Date();
  let file = now.toISOString().split('.')[0] + "_" + query;

  fs.writeFile(`./searchResults/${file}.csv`, csv, (err) => {
    if (err)
      return;
    console.log(`File saved: ${file}.csv`);
  });
}

// Save search results as JSON file
module.exports.json = (results, query) => {
  // Build file name
  let now = new Date();
  let file = now.toISOString().split('.')[0] + "_" + query;

  fs.writeFile(`./searchResults/${file}.json`, JSON.stringify(results), (err) => {
    if (err)
      return;
    console.log(`File saved: ${file}.json`);
  });
}
