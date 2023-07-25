

export const mint = async() => {
    const response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Enable CORS for all domains. You can restrict this to specific domains if needed.
        },
        body: JSON.stringify({ message: 'mint success!' }),
    };
    console.log(response);
    return response;
}
