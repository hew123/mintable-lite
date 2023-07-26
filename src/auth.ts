// For simple auth purpose
// Should use amazon cognito pool + JWT token
const USER_AUTH_MAPPING = {
    'oaifj3902i40931340': 'user_001',
    'r230o8ujflsdmldpod': 'user_002',
}

const dict = new Map<string, string>(Object.entries(USER_AUTH_MAPPING))

export function get_user_id(auth_token: string|undefined): string | undefined {
    return dict.get(auth_token ?? '')
}