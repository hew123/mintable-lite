import { 
    DynamoDBClient, 
} from '@aws-sdk/client-dynamodb';
import { 
    APIGatewayEvent,
    Handler,
    Context,
    APIGatewayProxyResult,
} from 'aws-lambda'
import { MintableController } from './controller';
import { MintablePersistenceService } from './persistance';

// TechDebt: pull out env vars
const client = new DynamoDBClient({
  region: 'localhost',
  endpoint: 'http://0.0.0.0:8000',
  credentials: {
    accessKeyId: 'MockAccessKeyId',
    secretAccessKey: 'MockSecretAccessKey'
  },
})
const TABLE_NAME = 'mintable'
const mintablePersistenceService = new MintablePersistenceService(client, TABLE_NAME);
const mintableController = new MintableController(mintablePersistenceService);

export const mintToken: Handler = async(event: APIGatewayEvent, context: Context)
    : Promise<APIGatewayProxyResult> => {
    console.log(event);
    const response = await mintableController.mintToken(event);
    console.log(response)
    return response;
}

export const getToken: Handler = async(event: APIGatewayEvent, context: Context)
: Promise<APIGatewayProxyResult> => {
    console.log(event);
    const response = await mintableController.getToken(event);
    console.log(response)
    return response;
}

export const listTokens: Handler = async(event: APIGatewayEvent, context: Context)
: Promise<APIGatewayProxyResult> => {
    console.log(event);
    const response = await mintableController.listTokens(event);
    console.log(response)
    return response;
}

