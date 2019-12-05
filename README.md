# github-recruiter
github-recruiter is a command line tool designed to fetch potential job candidates from GitHub. Source candidates from GitHub using the GraphQL API.

## Installation
Clone this repository.
```bash
git clone https://github.com/dmonaldo/github-recruiter.git
```

Install dependencies.
```bash
npm install
```

Create a `config.json` file in the root directory. A GitHub OAuth token is required, see required permissions [here](https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql).
```
{
  "github_auth_token": "PUT_YOUR_GITHUB_AUTH_TOKEN_HERE",
  "file_type": "csv",
  "users_per_search": 5
}
```

## Usage
All available search parameters are documented [here](https://help.github.com/en/github/searching-for-information-on-github). Results will be saved in a `searchResults` directory. CSV or JSON output files are supported.

```bash
location:"Medellín, Colombia" repos:>1 language:JavaScript
```

## Roadmap
- Improve usage documentation

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Make sure to add/update tests as appropriate.

## License
[ISC](https://choosealicense.com/licenses/isc/)
