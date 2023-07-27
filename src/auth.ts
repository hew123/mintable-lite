import { 
    APIGatewayEvent,
} from 'aws-lambda'

// Auth token to user ID mapping.
// For simple auth purpose only.
// Should replace with amazon cognito pool + JWT token for production
const USER_AUTH_MAPPING = {
    'oaifj3902i40931340': 'user_001',
    'r230o8ujflsdmldpod': 'user_002',
}
const dict = new Map<string, string>(Object.entries(USER_AUTH_MAPPING))

export function authenticate(event: APIGatewayEvent): {success: boolean, userId: string|null} {
    const authToken = event.headers?.authToken;
    const userId = dict.get(authToken ?? '')
    return {
        success: userId? true: false,
        userId: userId?? null
    }
}