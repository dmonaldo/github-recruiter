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
            repositories(first: 1) {
              totalCount
            },
            repositoriesContributedTo(first: 1) {
              totalCount
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
      }
      pageInfo {
  			endCursor,
        hasNextPage,
        hasPreviousPage,
        startCursor
      }
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
