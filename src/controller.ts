import { MintablePersistenceService } from "./persistance";
import { 
    APIGatewayEvent,
    APIGatewayProxyResult
} from 'aws-lambda'
import { Mintable } from "./dto";

const RESPONSE_HEADERS = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
}

export class MintableController {
    constructor(
        readonly persistenceService: MintablePersistenceService
    ) {
        // This is required because we are 
        // referencing these methods outside this class
        this.mintToken = this.mintToken.bind(this);
        this.getToken = this.getToken.bind(this);
        this.listTokens = this.listTokens.bind(this);
    }

    async mintToken(event: APIGatewayEvent, userId: string): Promise<APIGatewayProxyResult> {
        if (!event.body) {
            return {
                statusCode: 400,
                body: "Empty request Body",
                ...RESPONSE_HEADERS
            }
        }
        const eventBody = JSON.parse(event.body)
        if (!eventBody.mintId || !eventBody.name || !eventBody.description || !eventBody.image) {
            return {
                statusCode: 400,
                body: "Missing field(s) in request body",
                ...RESPONSE_HEADERS
            }
        }
        const tokenInput: Mintable = {
            userId: userId,
            mintId: eventBody.mintId,
            name: eventBody.name,
            description: eventBody.description,
            image: eventBody.image
        }
        try {
            const response = await this.persistenceService.mintToken(tokenInput);
            return {
                statusCode: 201,
                body: JSON.stringify(response),
                ...RESPONSE_HEADERS
            }
        }
        catch(err) {
            console.log(err)
            return {
                statusCode: 500,
                body: "Error minting token",
                ...RESPONSE_HEADERS
            }
        }
    }

    async getToken(event: APIGatewayEvent, userId: string): Promise<APIGatewayProxyResult> {
        const mintId = event.pathParameters?.mintId;
        if (!mintId) {
            return {
                statusCode: 400,
                body: "Missing mintId in query URL",
                ...RESPONSE_HEADERS
            }
        }
        try {
            const response = await this.persistenceService.getToken(userId, mintId);
            if (!response) {
                return {
                    statusCode: 404,
                    body: "Requested mintable token not found",
                    ...RESPONSE_HEADERS
                }
            }
            return {
                statusCode: 200,
                body: JSON.stringify(response),
                ...RESPONSE_HEADERS
            }
        }
        catch(err) {
            console.log(err)
            return {
                statusCode: 500,
                body: "Error getting token",
                ...RESPONSE_HEADERS
            }
        }
    }

    async listTokens(event: APIGatewayEvent, userId: string): Promise<APIGatewayProxyResult> {
        try {
            const response = await this.persistenceService.listTokens(userId);
            return {
                statusCode: 200,
                body: JSON.stringify(response),
                ...RESPONSE_HEADERS
            }
        }
        catch(err) {
            console.log(err)
            return {
                statusCode: 500,
                body: "Error listing tokens",
                ...RESPONSE_HEADERS
            }
        }
    }
}