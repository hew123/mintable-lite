# mintable-lite

MintableLite is an API service where users can mint, list and sell their NFTs. Every NFT has name, description, image / animation attributes. Users must be authenticated to mint, sell or buy an item. The app should have three endpoints to list all minted items, mint an item and get details of an item.


## To deploy
- make sure you have aws account setup
- `yarn sls deploy`


## To run server locally
- make sure you have `yarn` installed (e.g. via homebrew)
- `yarn install`
- `yarn serverless dynamodb install` to install local DynamoDB java program (requires Java to be installed). This isn't required if a DynamoDb docker image is used instead. (Refer to https://www.npmjs.com/package/serverless-dynamodb to learn about running DynamoDB locally in Docker)
- `yarn build`
- `yarn start`


## Local Authentication 
- Attach `userId` to the headers of API calls to the local server endpoint
- Refer to `src/auth` for a list of tokens allowed