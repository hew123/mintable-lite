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

const genericHandler = 
    (controller: (event: APIGatewayEvent) => Promise<APIGatewayProxyResult>) => {
        // TechDebt: should get cognito identity from context for auth
        return async(event: APIGatewayEvent, context: Context) : Promise<APIGatewayProxyResult> => {
            console.log(event);
            const response = await controller(event);
            console.log(response)
            return response;
        }   
}

export const mintToken: Handler = genericHandler(mintableController.mintToken)

export const getToken: Handler = genericHandler(mintableController.getToken)

export const listTokens: Handler = genericHandler(mintableController.listTokens)