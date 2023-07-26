import { 
    DynamoDBClient, 
    PutItemCommand, 
    QueryCommand, 
    GetItemCommand 
} from '@aws-sdk/client-dynamodb';
import { 
    APIGatewayEvent,
    Handler,
    Context,
    APIGatewayProxyResult,
} from 'aws-lambda'
import { get_user_id } from './auth';

// TODO: pull out env vars
// TODO: dependency injection
const client = new DynamoDBClient({
  region: 'localhost',
  endpoint: 'http://0.0.0.0:8000',
  credentials: {
    accessKeyId: 'MockAccessKeyId',
    secretAccessKey: 'MockSecretAccessKey'
  },
})

const MINT_ID = 'mintId'
const USER_ID = 'userId'
const TABLE_NAME = 'mintable'


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

export const mint = async(event: APIGatewayEvent, context: Context)
    : Promise<APIGatewayProxyResult> => {
    console.log(event);
    const input = {
        "Item": {
            "userId": {
                "S": "user_001"
              },  
            "mintId": {
                "S": "token_001"
            },
            "name": {
                "S": "Somewhat Famous"
            },
            "description": {
                "S": "No One You Know"
            },
            "image": {
                "S": "Call Me Today"
            }
        },
        "ReturnConsumedCapacity": "TOTAL",
        "TableName": TABLE_NAME
      };
      const command = new PutItemCommand(input);
      const response = await client.send(command);

    return wrapper({ message: 'mint success', response})
}

// TODO: return response other than 200 e.g. bad request, token not found
export const get = async(event: APIGatewayEvent, context: Context)
: Promise<APIGatewayProxyResult> => {
    console.log(event);
    const mintId = event.pathParameters?.mintId;
    const authToken = event.headers?.authToken;
    const userId = get_user_id(authToken)
    if (!mintId || !userId) {
        throw new Error('Bad request')
    }
    const input = {
        "Key": {
          "userId": {
            "S": userId
          },
          "mintId": {
            "S": mintId
          }
        },
        "TableName": TABLE_NAME
      };
      const command = new GetItemCommand(input);
      const response = await client.send(command);
    return wrapper({ message: 'get success', response})
}

export const list = async(event: APIGatewayEvent, context: Context)
: Promise<APIGatewayProxyResult> => {
    console.log(event);
    const input = {
        "ExpressionAttributeValues": {
            ":userId": {
                "S": 'user_001'
              },
        },
        "KeyConditionExpression": "userId = :userId",
        "TableName": TABLE_NAME
      };
      const command = new QueryCommand(input);
      const response = await client.send(command);
    return wrapper({ message: 'list success', response})
}

