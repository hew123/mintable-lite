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

export const mint = async() => {
    return wrapper({ message: 'mint success'})
}

export const get = async() => {
    return wrapper({ message: 'get success'})
}

export const list = async() => {
    return wrapper({ message: 'list success'})
}

