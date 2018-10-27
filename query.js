module.exports = `
  query($searchQuery: String!, $numResults: Int!, $endCursor: String) {
    search(query: $searchQuery, type: USER, first: $numResults, after: $endCursor) {
      edges {
  			node {
          ... on User {
            id,
            url,
            bio,
            email,
            name,
            repositories(first: 100) {
              totalCount,
            	edges {
                node {
                  name,
                  description
                }
              }
            },
            repositoriesContributedTo(first: 100) {
              totalCount,
            	edges {
                node {
                  name,
                  description
                }
              }
            },
            followers(first: 1) {
  						totalCount
            },
            following(first: 1) {
  						totalCount
            },
            pullRequests(first: 1) {
  						totalCount
            },
            isHireable
          }
        }
      },
      pageInfo {
  			endCursor,
        hasNextPage,
        hasPreviousPage,
        startCursor
      },
      userCount
    },
    rateLimit(dryRun: false) {
  		cost,
      limit,
      nodeCount,
      remaining,
      resetAt
    }
  }
`;
