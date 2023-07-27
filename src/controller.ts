import { MintablePersistenceService } from "./persistance";
import { 
    APIGatewayEvent,
    APIGatewayProxyResult
} from 'aws-lambda'
import { authenticate } from "./auth";
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
    ) {}

    async mintToken(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
        const { success, userId } = authenticate(event)
        if (!success) {
            return {
                statusCode: 403,
                body: "Unauthenticated",
                ...RESPONSE_HEADERS
            }
        }
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
            userId: userId!,
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

    async getToken(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
        const { success, userId } = authenticate(event)
        if (!success) {
            return {
                statusCode: 403,
                body: "Unauthenticated",
                ...RESPONSE_HEADERS
            }
        }
        const mintId = event.pathParameters?.mintId;
        if (!mintId) {
            return {
                statusCode: 400,
                body: "Missing mintId in query URL",
                ...RESPONSE_HEADERS
            }
        }
        try {
            const response = await this.persistenceService.getToken(userId!, mintId);
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

    async listTokens(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
        const { success, userId } = authenticate(event)
        if (!success) {
            return {
                statusCode: 403,
                body: "Unauthenticated",
                ...RESPONSE_HEADERS
            }
        }
        try {
            const response = await this.persistenceService.listTokens(userId!);
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