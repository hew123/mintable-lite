# mintable-lite

MintableLite is an API service where users can mint, list and sell their NFTs. Every NFT has name, description, image / animation attributes. Users must be authenticated to mint, sell or buy an item. The app should have three endpoints to list all minted items, mint an item and get details of an item.


## Implementaion
The task is implemented in the AWS serverless approach. API gateway is used to receive API requests with 3 lambdas sitting behind, each representing one endpoint. Then DynamoDB is used to store the NFT token information as a schemaless DB solution. A local naive auth mechanism with a local user store (in the code) is used for auth purpose. It should be replaced with AWS cognito for production as a managed auth service.

Serverless framework is used to spin up the local AWS resources. It is a smart framework that allows engineers to deploy AWS resources to production easily when AWS account has been setup, with one simple command: `yarn sls deploy`

Please refer to `./diagram.png` for architecture diagram.


## To run server locally
- make sure you have `yarn` installed (e.g. via homebrew)
- `yarn install`
- `yarn serverless dynamodb install` to install local DynamoDB java program (requires Java to be installed). This isn't required if a DynamoDb docker image is used instead. (Refer to https://www.npmjs.com/package/serverless-dynamodb to learn about running DynamoDB locally in Docker)
- `yarn build`
- `yarn start`


### Local Authentication 
- For every API call to the local server, attach `authToken` to the headers
- Refer to `./src/auth` for a list of auth tokens allowed
- `authToken` is a naive implementation of auth token which is then decoded to retrieve corresponding user IDs


### Mint a token
- creates a token with various fields: `mintId`, `name`, `description`, `image`
- returns a token with specified fields and the user ID used to create
- send POST request to `http://localhost:3000/dev/mint`
- Include in the API call body with the following fields: `mintId`, `name`, `description`, `image`
- example: `curl -d '{"mintId":"token_001","image":"hehe","name":"Al pastor","description":"A good taco"}' -H "authToken: [token]" -X POST http://localhost:3000/dev/mint`


### Get a token
- gets a token by mint ID that was specified in token creation (mint token) by the same user
- returns a token with specified fields if found
- returns 404 if token is not found by mint ID
- send GET request to `http://localhost:3000/dev/get/{mintId}`
- Include in the API call query string with the mint token ID
- example: `curl -H "authToken: [token]" -X GET http://localhost:3000/dev/get/token_001`


### List tokens
- returns a set of tokens created by the authenticated user
- send GET request to `http://localhost:3000/dev/list`
- example: `curl -H "authToken: [token]" -X GET http://localhost:3000/dev/list`