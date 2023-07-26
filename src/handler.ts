import { 
    DynamoDBClient, 
} from '@aws-sdk/client-dynamodb';
import { 
    APIGatewayEvent,
    Handler,
    Context,
    APIGatewayProxyResult,
} from 'aws-lambda'
import { get_user_id } from './auth';
import { Mintable } from './dto';
import { MintablePersistenceService } from './persistance';

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
const TABLE_NAME = 'mintable'
const mintablePersistenceService = new MintablePersistenceService(client, TABLE_NAME);

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

// TODO: return response other than 200 e.g. bad request, token not found
export const mintToken: Handler = async(event: APIGatewayEvent, context: Context)
    : Promise<APIGatewayProxyResult> => {
    console.log(event);
    const authToken = event.headers?.authToken;
    const userId = get_user_id(authToken)
    if (!userId) {
        throw new Error('Unauthenticated')
    }
    if (!event.body) {
        throw new Error('Empty request body')
    }
    const eventBody = JSON.parse(event.body)
    const tokenInput: Mintable = {
        userId: userId,
        mintId: eventBody.mintId,
        name: eventBody.name,
        description: eventBody.description,
        image: eventBody.image
    }
    const response = await mintablePersistenceService.mintToken(tokenInput);
    return wrapper({ message: 'mint success', response})
}

// TODO: return response other than 200 e.g. bad request, token not found
export const getToken: Handler = async(event: APIGatewayEvent, context: Context)
: Promise<APIGatewayProxyResult> => {
    console.log(event);
    const mintId = event.pathParameters?.mintId;
    const authToken = event.headers?.authToken;
    const userId = get_user_id(authToken)
    if (!mintId || !userId) {
        throw new Error('Bad request')
    }
    const response = await mintablePersistenceService.getToken(userId, mintId);
    return wrapper({ message: 'get success', response})
}

// TODO: return response other than 200 e.g. bad request, token not found
export const listTokens: Handler = async(event: APIGatewayEvent, context: Context)
: Promise<APIGatewayProxyResult> => {
    console.log(event);
    const authToken = event.headers?.authToken;
    const userId = get_user_id(authToken)
    if (!userId) {
        throw new Error('Unauthenticated')
    }
    const response = await mintablePersistenceService.listTokens(userId);
    return wrapper({ message: 'list success', response})
}

