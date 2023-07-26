import { 
    DynamoDBClient, 
    PutItemCommand, 
    QueryCommand, 
    GetItemCommand 
} from '@aws-sdk/client-dynamodb';
import { Mintable } from './dto';


export class MintablePersistenceService {
    constructor(
        readonly ddbClient: DynamoDBClient,
        readonly tableName: string
    ) {}

    async mintToken(tokenInput: Mintable): Promise<Mintable> {
        const input = {
            "Item": {
                "userId": {
                    "S": tokenInput.userId
                  },  
                "mintId": {
                    "S": tokenInput.mintId
                },
                "name": {
                    "S": tokenInput.name
                },
                "description": {
                    "S": tokenInput.description
                },
                "image": {
                    "S": tokenInput.image
                }
            },
            "ReturnConsumedCapacity": "TOTAL",
            "TableName": this.tableName
        };
        const command = new PutItemCommand(input);
        const response = await this.ddbClient.send(command);
        console.log(response);
        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('Minting failed')
        } 
        return tokenInput;
    }

    async getToken(userId: string, mintId: string): Promise<Mintable|null> {
        const input = {
            "Key": {
              "userId": {
                "S": userId
              },
              "mintId": {
                "S": mintId
              }
            },
            "TableName": this.tableName
        };
        const command = new GetItemCommand(input);
        const response = await this.ddbClient.send(command);
        console.log(response);
        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('Getting token failed')
        }
        const token = response.Item
        return token ? {
            userId: token.userId.S as string,
            mintId: token.mintId.S as string,
            name: token.name.S as string,
            description: token.description.S as string,
            image: token.image.S as string,
        }: null;
    }

    async listTokens(userId: string): Promise<Mintable[]> {
        const input = {
            "ExpressionAttributeValues": {
                ":userId": {
                    "S": userId
                  },
            },
            "KeyConditionExpression": "userId = :userId",
            "TableName": this.tableName
        };
        const command = new QueryCommand(input);
        const response = await this.ddbClient.send(command);
        console.log(response);
        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('Listing token failed')
        }
        const tokens = response.Items
        return tokens ? tokens.map(token => { 
            return {
                userId: token.userId.S as string,
                mintId: token.mintId.S as string,
                name: token.name.S as string,
                description: token.description.S as string,
                image: token.image.S as string,
            }
        }): [];
    }
}