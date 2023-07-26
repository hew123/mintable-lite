import { MintablePersistenceService } from "./persistance";
import { 
    APIGatewayEvent,
} from 'aws-lambda'
import { authenticate } from "./auth";
import { Mintable } from "./dto";

export interface PartialHttpResp {
    statusCode: number;
    body: string;
}

export class MintableController {
    constructor(
        readonly persistenceService: MintablePersistenceService
    ) {}

    async mintToken(event: APIGatewayEvent): Promise<PartialHttpResp> {
        const { success, userId} = authenticate(event)
        if (!success) {
            return {
                statusCode: 403,
                body: "Unauthenticated"
            }
        }
        if (!event.body) {
            return {
                statusCode: 400,
                body: "Empty request Body"
            }
        }
        const eventBody = JSON.parse(event.body)
        if (!eventBody.mintId || !eventBody.name || !eventBody.description || !eventBody.image) {
            return {
                statusCode: 400,
                body: "Missing field(s) in request body"
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
                body: JSON.stringify(response)
            }
        }
        catch(err) {
            console.log(err)
            return {
                statusCode: 500,
                body: "Error minting token"
            }
        }
    }

    async getToken(event: APIGatewayEvent): Promise<PartialHttpResp> {
        const { success, userId} = authenticate(event)
        if (!success) {
            return {
                statusCode: 403,
                body: "Unauthenticated"
            }
        }
        const mintId = event.pathParameters?.mintId;
        if (!mintId) {
            return {
                statusCode: 400,
                body: "Missing mintId in query URL"
            }
        }
        try {
            const response = await this.persistenceService.getToken(userId!, mintId);
            if (!response) {
                return {
                    statusCode: 404,
                    body: "Requested mintable token not found"
                }
            }
            return {
                statusCode: 200,
                body: JSON.stringify(response)
            }
        }
        catch(err) {
            console.log(err)
            return {
                statusCode: 500,
                body: "Error getting token"
            }
        }
    }

    async listTokens(event: APIGatewayEvent): Promise<PartialHttpResp> {
        const { success, userId} = authenticate(event)
        if (!success) {
            return {
                statusCode: 403,
                body: "Unauthenticated"
            }
        }
        try {
            const response = await this.persistenceService.listTokens(userId!);
            return {
                statusCode: 200,
                body: JSON.stringify(response)
            }
        }
        catch(err) {
            console.log(err)
            return {
                statusCode: 500,
                body: "Error listing tokens"
            }
        }
    }
}