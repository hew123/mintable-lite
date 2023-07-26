import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: 'localhost',
  endpoint: 'http://0.0.0.0:8000',
  credentials: {
    accessKeyId: 'MockAccessKeyId',
    secretAccessKey: 'MockSecretAccessKey'
  },
})


const RESPONSE_200 = {
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Enable CORS for all domains. You can restrict this to specific domains if needed.
    }
}

const wrapper = (body: object) => {
    const response = {
        ...RESPONSE_200,
        body: JSON.stringify(body),
    };
    console.log(response);
    return response;
}

export const mint = async() => {
    const input = {
        "Item": {
          "mintId": {
            "S": "token_001"
          },  
          "AlbumTitle": {
            "S": "Somewhat Famous"
          },
          "Artist": {
            "S": "No One You Know"
          },
          "SongTitle": {
            "S": "Call Me Today"
          }
        },
        "ReturnConsumedCapacity": "TOTAL",
        "TableName": "mintable"
      };
      const command = new PutItemCommand(input);
      const response = await client.send(command);

    return wrapper({ message: 'mint success', response})
}

export const get = async() => {
    const input = {
        "ExpressionAttributeValues": {
          ":mintId": {
            "S": 'token_001'
          }
        },
        "KeyConditionExpression": "mintId = :mintId",
        //"ProjectionExpression": "SongTitle",
        "TableName": "mintable"
      };
      const command = new QueryCommand(input);
      const response = await client.send(command);
    return wrapper({ message: 'get success', response})
}

export const list = async() => {
    return wrapper({ message: 'list success'})
}

